<?php
require '../vendor/autoload.php';

//  Allows us to communicate with this PHP script from our front-end application
header('Accept: x-www-form-urlencoded');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

//  Establish a connection to database
$db = new DatabaseConnection();

$data = [];

//  Determine the type of incoming request
switch($_SERVER["REQUEST_METHOD"]) {
  
  case "POST": //  Request: Insert a row/update a row

    //  Get parameters posted to this script
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_DEFAULT);
    $amazingLevel = filter_input(INPUT_POST, 'amazing_level', FILTER_DEFAULT);
    $country = filter_input(INPUT_POST, 'country', FILTER_DEFAULT);

    if(isset($id)) {
      //  Use DatabaseConnection to update the row
      $db->update($id, $name, $amazingLevel, $country);
    } else {
      //  Use DatabaseConnection to create the row
      $id = $db->create($name, $amazingLevel, $country);
    }

    $data = ['id' => $id, 'name' => $name, 'amazing_level' => $amazingLevel, 'country' => $country];

    break;

  case "GET": //  Request: Get a row/all rows

    //  Get parameters posted to this script
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    if(isset($id)) {
      //  Use DatabaseConnection to get the row
      $data = $db->get($id);
    } else {
      //  Use DatabaseConnection to get all rows
      $data = $db->all();
    }

    break;


  case "DELETE": //  Request: Delete a row

    //  Get parameters posted to this script
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

    //  Use DatabaseConnection to delete the row
    $db->delete($id);

    $data = ['id' => $id];

    break;

}

//  Output JSON payout
header('Content-Type: application/json');
echo HandleRequest::parse($data);

//  -------------------------------------------------------------------------
//
//  HandleRequest: 
//  Provides a way return results to front-end application from database. 
//
//  Usage:
//  return HandleRequest::parse($data);
//
//  -------------------------------------------------------------------------

class HandleRequest {
  public static function parse($data) {
    try {
      $result = [
        'status' => 'OK',
        'data' => $data
      ];
    } catch(Exception $exception) {
      $result = [
        'status' => 'ERROR',
        'data' => null
      ];
    }
    
    return json_encode($result);
  }
}

//  -------------------------------------------------------------------------
//
//  DatabaseConnection: 
//  Provides a way to create, update, delete rows in a table called 'records'. 
//
//  Usage:
//  $db = new DatabaseConnection();
//
//  Getting a row: 
//  $db->get(1); 
//
//  Getting all rows:
//  $db->all();
//
//  Deleting a row:
//  $db->delete(1);
//
//  Creating a row:
//  $db->create("Kylie Minogue", 10, "Australia");
//
//  Updating a row:
//  $db->update(1, "2 Unlimited", 7, "Belgium");
//
//  -------------------------------------------------------------------------

class DatabaseConnection {
  public $connection;

  function __construct() {
    $this->connect();
    $this->setup();
  }
  
  //  Get a row from the records table
  public function get($id) {
    //  Get a specific row by 'id', return as an associative array
    $results = pg_query_params($this->getConnection(), "SELECT * FROM records WHERE id = $1 ORDER BY name LIMIT 1", array(intval($id)));
    $row = pg_fetch_assoc($results);

    return $row;
  }

  //  Gets all rows from the records table
  public function all() {
    //  Get all rows, return them as an associative array
    $results = pg_query($this->getConnection(), "SELECT * FROM records ORDER BY name");
    $rows = pg_fetch_all($results);

    return $rows;
  }

  //  Creates a row in the records table
  public function create($name, $amazingLevel, $country) {
    try {
      @pg_prepare($this->getConnection(), "create_record", "INSERT INTO records (name, amazing_level, country) VALUES ($1, $2, $3) RETURNING id;");
      
      //  Execute prepared statement
      $result = pg_execute($this->getConnection(), "create_record", array($name, $amazingLevel, $country));
      $row = pg_fetch_assoc($result);

      $id = isset($row['id']) ? $row['id'] : null;

      //  Return ID of created row
      return $id;
    } catch(Exception $e) {
      return FALSE;
    }
  }

  //  Updates a row in the records table
  public function update($id, $name, $amazingLevel, $country) {
    try {
      @pg_prepare($this->getConnection(), "update_record", "UPDATE records SET name = $2, amazing_level = $3, country = $4 WHERE id = $1;");
  
      //  Execute prepared statement
      pg_execute($this->getConnection(), "update_record", array($id, $name, $amazingLevel, $country));

      return TRUE;
    } catch(Exception $e) {
      return FALSE;
    }
  }

  //  Updates a row in the records table
  public function delete($id) {
    try {
      @pg_prepare($this->getConnection(), "delete_record", "DELETE FROM records WHERE id = $1;");

      //  Execute prepared statement
      pg_execute($this->getConnection(), "delete_record", array($id));

      return TRUE;
    } catch(Exception $e) {
      return FALSE;
    }
  }

  //  Drops the records table
  public function drop() {
    try {
      @pg_prepare($this->getConnection(), "drop_records", "DROP TABLE records;");

      //  Execute prepared statement
      pg_execute($this->getConnection(), "drop_records", array());

      return TRUE;
    } catch(Exception $e) {
      return FALSE;
    }
  }

  //  Create table 'records'
  function createTable() {
    try {
      @pg_prepare($this->getConnection(), "create_table", "CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        name CHARACTER VARYING(100),
        amazing_level INT,
        country CHARACTER VARYING(100)
      );");

      //  Execute prepared statement
      pg_execute($this->getConnection(), "create_table", array());

      return TRUE;
    } catch(Exception $e) {
      return FALSE;
    }
  }

  //  Establish connection to database
  function connect() {
    $this->connection = pg_connect($this->getConnectionString());
  }

  //  Get reference to current connection
  function getConnection() {
    return $this->connection;
  }

  //  Get database connection string
  function getConnectionString() {
    extract(parse_url($_ENV["DATABASE_URL"]));
    return "user=$user password=$pass host=$host dbname=" . substr($path, 1);
  }

  //  Test if records table exists
  function test() {
    $results = @pg_query($this->getConnection(), "SELECT * FROM records LIMIT 1");
    $data = null;

    if($results) {
      $data = pg_fetch_assoc($results);
    }
    
    return $data ? TRUE : FALSE;
  }

  //  Creates record table and inserts a few fake records
  function setup() {
    //  Comment out this line to start fresh
    if($this->test()) return;

    //  Drop/create table
    $this->drop();
    $this->createTable();

    //  Create some fake records
    // $this->create("Sugababes", 9, "England");
    // $this->create("Kylie Minogue", 10, "Australia");
    // $this->create("2 Unlimited", 8, "Germany");
    // $this->create("Brooklyn Bounce", 7, "United States");
  }

}

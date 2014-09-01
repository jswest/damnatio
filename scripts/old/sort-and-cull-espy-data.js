var keys = {
  "race": {
    "M": "Do Not Know; NA",
    "0": "Do Not Know; NA",
    "1": "White",
    "2": "Black",
    "3": "Native American",
    "4": "Asian-Pacific Il",
    "5": "Hispanic",
    "6": "Other"
  },
  "placeOfExecution": {
    "M": "Do Not Know; NA",
    "0": "Do Not Know; NA",
    "1": "City-Local Juris",
    "2": "County-Local Jur",
    "3": "State-ST Prison",
    "4": "Other"    
  },
  "jurisdictionOfExecution": {
    "M": "Do Not Know; NA",
    "0": "Do Not Know; NA",
    "1": "Local-Colonial",
    "2": "State",
    "3": "Federal",
    "4": "Territorial",
    "5": "Indian Tribunal",
    "6": "Other-Military"
  },
  "method": {
    "MM": "Do Not Know; NA", 
    "00": "Do Not Know; NA",
    "01": "Hanging",
    "02": "Electrocution",
    "03": "Asphyxiation-Gas",
    "04": "Shot",
    "05": "Injection",
    "06": "Pressing",
    "08": "Break on Wheel",
    "10": "Burned",
    "11": "Hung in Chains",
    "13": "Bludgeoned",
    "14": "Gibbetted",
    "15": "Other"
  }

}


var fs = require( 'fs' );

var lines = fs.readFileSync( 'data/raw/08451-0001-Data.txt' ).toString().split( "\n" );





var data = [];
for ( var i = 0; i < lines.length - 1; i++ ) {
  var line = lines[i];
  var race = lines[i].slice( '12', '13' );
  var ageAtExecution = lines[i].slice( '13', '15' );
  if ( ageAtExecution === "  " ) {
    ageAtExecution = "unknown";
  }
  var name = lines[i].slice( '15', '43' ).trim();
  var nameArray = name.split( " " );
  var firstName = nameArray.pop();
  nameArray.unshift( firstName );
  name = nameArray.join( ' ' );
  var placeOfExecution = lines[i].slice( '43', '44' );
  var jurisdictionOfExecution = lines[i].slice( '44', '45' );
  var method = lines[i].slice( '47', '49' );
  if ( method === "" ) {
    method = "unknown";
  }
  var year = lines[i].slice( '53', '57' );
  
  var datum = {
    "race": keys.race[race],
    "name": name,
    "method": keys.method[method],
    "year": year
  };
  data.push( datum );
}

fs.writeFile( 'data/espy-full.json', JSON.stringify( data, null, "\t" ), function ( error ) {
  if ( error ) {
    console.log( error );
  } else {
    console.log( 'file written.' );
  }
} );

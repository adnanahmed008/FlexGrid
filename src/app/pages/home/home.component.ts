import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TABLE, ESortDirection, IRow, IColumn, EColType, deepCopy, ICell } from 'src/app/models/FlexGrid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  private srvData: DataService;
  private table: TABLE;

  constructor() { }

  ngOnInit(): void {
    this.srvData = new DataService(() => {
      this.initTable();
    })
  }

  initTable() {
    let columns: IColumn[] = [
      { key: "SELECT", title: "", type: EColType.CHECKBOX, canSort: false, styles: { width: "20px" } },
      { key: "FIRSTNAME", title: "First Name", styles: { width: "15%" } },
      { key: "LASTNAME", title: "Last Name", styles: { width: "15%" } },
      { key: "ADDRESS", title: "Address", styles: { width: "20%" } },
      { key: "City", title: "City", styles: { width: "20%" }, canSort: false },
      { key: "STATE", title: "State", styles: { width: "20%" } },
      { key: "ZIP", title: "Zip" }
    ];
    this.table = new TABLE({
      tableId: "grid",
      pagerId: "pager",
      columns: columns,
      multiSelect: true,
      sortBy: columns[1].key,
      sortDirection: ESortDirection.DECENDING,
      dataCallback: (pageNumber, pageSize, sortBy, sortDirection): Promise<{
        rows: IRow[];
        total: number;
        hasError: boolean;
      }> => {
        return new Promise(resolve => {
          let resp = this.srvData.getData(pageNumber, pageSize, sortBy, sortDirection, columns[0].type == EColType.CHECKBOX ? columns.findIndex(c => c.key == sortBy) - 1 : columns.findIndex(c => c.key == sortBy));
          resolve(resp);
        })
      }
    });
  }

  getSelectedRow() {
    console.log(this.table.getSelectedRows());
  }
}

class DataService {
  private rows: IRow[] = [];
  private persons = [
    {
      "address": "1 Central Ave",
      "city": "Stevens Point",
      "firstName": "Allene",
      "lastName": "Iturbide",
      "state": "WI",
      "zip": 54481
    },
    {
      "address": "1 Century Park E",
      "city": "San Diego",
      "firstName": "Mari",
      "lastName": "Lueckenbach",
      "state": "CA",
      "zip": 92110
    },
    {
      "address": "1 Commerce Way",
      "city": "Portland",
      "firstName": "Twana",
      "lastName": "Felger",
      "state": "OR",
      "zip": 97224
    },
    {
      "address": "1 Garfield Ave #7",
      "city": "Canton",
      "firstName": "Salena",
      "lastName": "Karpel",
      "state": "OH",
      "zip": 44707
    },
    {
      "address": "1 Huntwood Ave",
      "city": "Phoenix",
      "firstName": "Arminda",
      "lastName": "Parvis",
      "state": "AZ",
      "zip": 85017
    },
    {
      "address": "1 Midway Rd",
      "city": "Westborough",
      "firstName": "Nicolette",
      "lastName": "Brossart",
      "state": "MA",
      "zip": "01581"
    },
    {
      "address": "1 N Harlem Ave #9",
      "city": "Orange",
      "firstName": "Talia",
      "lastName": "Riopelle",
      "state": "NJ",
      "zip": "07050"
    },
    {
      "address": "1 N San Saba",
      "city": "Erie",
      "firstName": "Jacqueline",
      "lastName": "Rowling",
      "state": "PA",
      "zip": 16501
    },
    {
      "address": "1 Rancho Del Mar Shopping C",
      "city": "Providence",
      "firstName": "Hermila",
      "lastName": "Thyberg",
      "state": "RI",
      "zip": "02903"
    },
    {
      "address": "1 S Pine St",
      "city": "Memphis",
      "firstName": "Linn",
      "lastName": "Paa",
      "state": "TN",
      "zip": 38112
    },
    {
      "address": "1 State Route 27",
      "city": "Taylor",
      "firstName": "Yuki",
      "lastName": "Whobrey",
      "state": "MI",
      "zip": 48180
    },
    {
      "address": "1 Washington St",
      "city": "Lake Worth",
      "firstName": "Joanna",
      "lastName": "Leinenbach",
      "state": "FL",
      "zip": 33461
    },
    {
      "address": "10276 Brooks St",
      "city": "San Francisco",
      "firstName": "Trinidad",
      "lastName": "Mcrae",
      "state": "CA",
      "zip": 94105
    },
    {
      "address": "1048 Main St",
      "city": "Fairbanks",
      "firstName": "Roxane",
      "lastName": "Campain",
      "state": "AK",
      "zip": 99708
    },
    {
      "address": "105 Richmond Valley Rd",
      "city": "Escondido",
      "firstName": "Clorinda",
      "lastName": "Heimann",
      "state": "CA",
      "zip": 92025
    },
    {
      "address": "10759 Main St",
      "city": "Scottsdale",
      "firstName": "Regenia",
      "lastName": "Kannady",
      "state": "AZ",
      "zip": 85260
    },
    {
      "address": "1088 Pinehurst St",
      "city": "Chapel Hill",
      "firstName": "Johnetta",
      "lastName": "Abdallah",
      "state": "NC",
      "zip": 27514
    },
    {
      "address": "11279 Loytan St",
      "city": "Jacksonville",
      "firstName": "Arlette",
      "lastName": "Honeywell",
      "state": "FL",
      "zip": 32254
    },
    {
      "address": "1128 Delaware St",
      "city": "San Jose",
      "firstName": "Aliza",
      "lastName": "Baltimore",
      "state": "CA",
      "zip": 95132
    },
    {
      "address": "11360 S Halsted St",
      "city": "Santa Ana",
      "firstName": "Daniel",
      "lastName": "Perruzza",
      "state": "CA",
      "zip": 92705
    },
    {
      "address": "12270 Caton Center Dr",
      "city": "Eugene",
      "firstName": "Carissa",
      "lastName": "Batman",
      "state": "OR",
      "zip": 97401
    },
    {
      "address": "128 Bransten Rd",
      "city": "New York",
      "firstName": "Jose",
      "lastName": "Stockham",
      "state": "NY",
      "zip": 10011
    },
    {
      "address": "13 Gunnison St",
      "city": "Plano",
      "firstName": "Ryan",
      "lastName": "Harnos",
      "state": "TX",
      "zip": 75075
    },
    {
      "address": "13 S Hacienda Dr",
      "city": "Livingston",
      "firstName": "Erinn",
      "lastName": "Canlas",
      "state": "NJ",
      "zip": "07039"
    },
    {
      "address": "13252 Lighthouse Ave",
      "city": "Cathedral City",
      "firstName": "Olive",
      "lastName": "Matuszak",
      "state": "CA",
      "zip": 92234
    },
    {
      "address": "134 Lewis Rd",
      "city": "Nashville",
      "firstName": "Audra",
      "lastName": "Kohnert",
      "state": "TN",
      "zip": 37211
    },
    {
      "address": "137 Pioneer Way",
      "city": "Chicago",
      "firstName": "Valentin",
      "lastName": "Klimek",
      "state": "IL",
      "zip": 60604
    },
    {
      "address": "14288 Foster Ave #4121",
      "city": "Jenkintown",
      "firstName": "Amber",
      "lastName": "Monarrez",
      "state": "PA",
      "zip": 19046
    },
    {
      "address": "14302 Pennsylvania Ave",
      "city": "Huntingdon Valley",
      "firstName": "Deeanna",
      "lastName": "Juhas",
      "state": "PA",
      "zip": 19006
    },
    {
      "address": "1482 College Ave",
      "city": "Fayetteville",
      "firstName": "Lonna",
      "lastName": "Diestel",
      "state": "NC",
      "zip": 28301
    },
    {
      "address": "1610 14th St Nw",
      "city": "Newport News",
      "firstName": "Jolene",
      "lastName": "Ostolaza",
      "state": "VA",
      "zip": 23608
    },
    {
      "address": "1644 Clove Rd",
      "city": "Miami",
      "firstName": "Rikki",
      "lastName": "Nayar",
      "state": "FL",
      "zip": 33155
    },
    {
      "address": "16452 Greenwich St",
      "city": "Garden City",
      "firstName": "Gilma",
      "lastName": "Liukko",
      "state": "NY",
      "zip": 11530
    },
    {
      "address": "17 Jersey Ave",
      "city": "Englewood",
      "firstName": "Mitzie",
      "lastName": "Hudnall",
      "state": "CO",
      "zip": 80110
    },
    {
      "address": "17 Morena Blvd",
      "city": "Camarillo",
      "firstName": "Rozella",
      "lastName": "Ostrosky",
      "state": "CA",
      "zip": 93012
    },
    {
      "address": "17 Us Highway 111",
      "city": "Round Rock",
      "firstName": "Fannie",
      "lastName": "Lungren",
      "state": "TX",
      "zip": 78664
    },
    {
      "address": "170 Wyoming Ave",
      "city": "Burnsville",
      "firstName": "Cyndy",
      "lastName": "Goldammer",
      "state": "MN",
      "zip": 55337
    },
    {
      "address": "1747 Calle Amanecer #2",
      "city": "Anchorage",
      "firstName": "Wilda",
      "lastName": "Giguere",
      "state": "AK",
      "zip": 99501
    },
    {
      "address": "177 S Rider Trl #52",
      "city": "Crystal River",
      "firstName": "Nickolas",
      "lastName": "Juvera",
      "state": "FL",
      "zip": 34429
    },
    {
      "address": "18 3rd Ave",
      "city": "New York",
      "firstName": "Jess",
      "lastName": "Chaffins",
      "state": "NY",
      "zip": 10016
    },
    {
      "address": "18 Coronado Ave #563",
      "city": "Pasadena",
      "firstName": "Staci",
      "lastName": "Schmaltz",
      "state": "CA",
      "zip": 91106
    },
    {
      "address": "18 Fountain St",
      "city": "Anchorage",
      "firstName": "Penney",
      "lastName": "Weight",
      "state": "AK",
      "zip": 99515
    },
    {
      "address": "18 Waterloo Geneva Rd",
      "city": "Highland Park",
      "firstName": "Daron",
      "lastName": "Dinos",
      "state": "IL",
      "zip": 60035
    },
    {
      "address": "1844 Southern Blvd",
      "city": "Little Rock",
      "firstName": "Carin",
      "lastName": "Deleo",
      "state": "AR",
      "zip": 72202
    },
    {
      "address": "185 Blackstone Bldge",
      "city": "Honolulu",
      "firstName": "Angella",
      "lastName": "Cetta",
      "state": "HI",
      "zip": 96817
    },
    {
      "address": "187 Market St",
      "city": "Atlanta",
      "firstName": "Paris",
      "lastName": "Wide",
      "state": "GA",
      "zip": 30342
    },
    {
      "address": "189 Village Park Rd",
      "city": "Crestview",
      "firstName": "Marge",
      "lastName": "Limmel",
      "state": "FL",
      "zip": 32536
    },
    {
      "address": "19 Amboy Ave",
      "city": "Miami",
      "firstName": "Jeanice",
      "lastName": "Claucherty",
      "state": "FL",
      "zip": 33142
    },
    {
      "address": "1933 Packer Ave #2",
      "city": "Novato",
      "firstName": "Lai",
      "lastName": "Harabedian",
      "state": "CA",
      "zip": 94945
    },
    {
      "address": "195 13n N",
      "city": "Santa Clara",
      "firstName": "Merilyn",
      "lastName": "Bayless",
      "state": "CA",
      "zip": 95054
    },
    {
      "address": "1950 5th Ave",
      "city": "Milwaukee",
      "firstName": "Noah",
      "lastName": "Kalafatis",
      "state": "WI",
      "zip": 53209
    },
    {
      "address": "1953 Telegraph Rd",
      "city": "Saint Joseph",
      "firstName": "Diane",
      "lastName": "Devreese",
      "state": "MO",
      "zip": 64504
    },
    {
      "address": "2 A Kelley Dr",
      "city": "Katonah",
      "firstName": "Leslie",
      "lastName": "Threets",
      "state": "NY",
      "zip": 10536
    },
    {
      "address": "2 Cedar Ave #84",
      "city": "Easton",
      "firstName": "Ezekiel",
      "lastName": "Chui",
      "state": "MD",
      "zip": 21601
    },
    {
      "address": "2 Flynn Rd",
      "city": "Hicksville",
      "firstName": "Dean",
      "lastName": "Ketelsen",
      "state": "NY",
      "zip": 11801
    },
    {
      "address": "2 Lighthouse Ave",
      "city": "Hopkins",
      "firstName": "Fatima",
      "lastName": "Saylors",
      "state": "MN",
      "zip": 55343
    },
    {
      "address": "2 Monroe St",
      "city": "San Mateo",
      "firstName": "Xuan",
      "lastName": "Rochin",
      "state": "CA",
      "zip": 94403
    },
    {
      "address": "2 S 15th St",
      "city": "Fort Worth",
      "firstName": "Whitley",
      "lastName": "Tomasulo",
      "state": "TX",
      "zip": 76107
    },
    {
      "address": "2 S Biscayne Blvd",
      "city": "Baltimore",
      "firstName": "Kaitlyn",
      "lastName": "Ogg",
      "state": "MD",
      "zip": 21230
    },
    {
      "address": "2 Se 3rd Ave",
      "city": "Mesquite",
      "firstName": "Sue",
      "lastName": "Kownacki",
      "state": "TX",
      "zip": 75149
    },
    {
      "address": "2 Sw Nyberg Rd",
      "city": "Elkhart",
      "firstName": "Raylene",
      "lastName": "Kampa",
      "state": "IN",
      "zip": 46514
    },
    {
      "address": "2 W Beverly Blvd",
      "city": "Harrisburg",
      "firstName": "Ahmed",
      "lastName": "Angalich",
      "state": "PA",
      "zip": 17110
    },
    {
      "address": "2 W Grand Ave",
      "city": "Memphis",
      "firstName": "Bernardine",
      "lastName": "Rodefer",
      "state": "TN",
      "zip": 38112
    },
    {
      "address": "2 W Mount Royal Ave",
      "city": "Fortville",
      "firstName": "Gary",
      "lastName": "Nunlee",
      "state": "IN",
      "zip": 46040
    },
    {
      "address": "2 W Scyene Rd #3",
      "city": "Baltimore",
      "firstName": "Izetta",
      "lastName": "Dewar",
      "state": "MD",
      "zip": 21217
    },
    {
      "address": "20 S Babcock St",
      "city": "Fairbanks",
      "firstName": "Erick",
      "lastName": "Ferencz",
      "state": "AK",
      "zip": 99712
    },
    {
      "address": "201 Hawk Ct",
      "city": "Providence",
      "firstName": "Blondell",
      "lastName": "Pugh",
      "state": "RI",
      "zip": "02904"
    },
    {
      "address": "201 Ridgewood Rd",
      "city": "Moscow",
      "firstName": "Winfred",
      "lastName": "Brucato",
      "state": "ID",
      "zip": 83843
    },
    {
      "address": "20113 4th Ave E",
      "city": "Kearny",
      "firstName": "Lili",
      "lastName": "Paskin",
      "state": "NJ",
      "zip": "07032"
    },
    {
      "address": "2023 Greg St",
      "city": "Saint Paul",
      "firstName": "Chantell",
      "lastName": "Maynerich",
      "state": "MN",
      "zip": 55101
    },
    {
      "address": "2026 N Plankinton Ave #3",
      "city": "Austin",
      "firstName": "Rebecka",
      "lastName": "Gesick",
      "state": "TX",
      "zip": 78754
    },
    {
      "address": "206 Main St #2804",
      "city": "Lansing",
      "firstName": "Ligia",
      "lastName": "Reiber",
      "state": "MI",
      "zip": 48933
    },
    {
      "address": "209 Decker Dr",
      "city": "Philadelphia",
      "firstName": "Blair",
      "lastName": "Malet",
      "state": "PA",
      "zip": 19132
    },
    {
      "address": "20932 Hedley St",
      "city": "Concord",
      "firstName": "Micaela",
      "lastName": "Rhymes",
      "state": "CA",
      "zip": 94520
    },
    {
      "address": "2094 Montour Blvd",
      "city": "Muskegon",
      "firstName": "Sharee",
      "lastName": "Maile",
      "state": "MI",
      "zip": 49442
    },
    {
      "address": "2094 Ne 36th Ave",
      "city": "Worcester",
      "firstName": "Levi",
      "lastName": "Munis",
      "state": "MA",
      "zip": "01603"
    },
    {
      "address": "2139 Santa Rosa Ave",
      "city": "Orlando",
      "firstName": "Denise",
      "lastName": "Patak",
      "state": "FL",
      "zip": 32801
    },
    {
      "address": "2140 Diamond Blvd",
      "city": "Rohnert Park",
      "firstName": "Glendora",
      "lastName": "Sarbacher",
      "state": "CA",
      "zip": 94928
    },
    {
      "address": "21575 S Apple Creek Rd",
      "city": "Omaha",
      "firstName": "Colette",
      "lastName": "Kardas",
      "state": "NE",
      "zip": 68124
    },
    {
      "address": "2167 Sierra Rd",
      "city": "East Lansing",
      "firstName": "Kenneth",
      "lastName": "Grenet",
      "state": "MI",
      "zip": 48823
    },
    {
      "address": "2184 Worth St",
      "city": "Hayward",
      "firstName": "Refugia",
      "lastName": "Jacobos",
      "state": "CA",
      "zip": 94545
    },
    {
      "address": "22 Bridle Ln",
      "city": "Valley Park",
      "firstName": "Tresa",
      "lastName": "Sweely",
      "state": "MO",
      "zip": 63088
    },
    {
      "address": "22 Spruce St #595",
      "city": "Gardena",
      "firstName": "Dick",
      "lastName": "Wenzinger",
      "state": "CA",
      "zip": 90248
    },
    {
      "address": "2215 Prosperity Dr",
      "city": "Lyndhurst",
      "firstName": "Pete",
      "lastName": "Dubaldi",
      "state": "NJ",
      "zip": "07071"
    },
    {
      "address": "2239 Shawnee Mission Pky",
      "city": "Tullahoma",
      "firstName": "Jesusa",
      "lastName": "Shin",
      "state": "TN",
      "zip": 37388
    },
    {
      "address": "228 Runamuck Pl #2808",
      "city": "Baltimore",
      "firstName": "Kris",
      "lastName": "Marrier",
      "state": "MD",
      "zip": 21224
    },
    {
      "address": "229 N Forty Driv",
      "city": "New York",
      "firstName": "Layla",
      "lastName": "Springe",
      "state": "NY",
      "zip": 10011
    },
    {
      "address": "23 Palo Alto Sq",
      "city": "Miami",
      "firstName": "Ressie",
      "lastName": "Auffrey",
      "state": "FL",
      "zip": 33134
    },
    {
      "address": "2371 Jerrold Ave",
      "city": "Kulpsville",
      "firstName": "Minna",
      "lastName": "Amigon",
      "state": "PA",
      "zip": 19443
    },
    {
      "address": "2409 Alabama Rd",
      "city": "Riverside",
      "firstName": "Sheridan",
      "lastName": "Zane",
      "state": "CA",
      "zip": 92501
    },
    {
      "address": "25 E 75th St #69",
      "city": "Los Angeles",
      "firstName": "Kiley",
      "lastName": "Caldarera",
      "state": "CA",
      "zip": 90034
    },
    {
      "address": "25 Minters Chapel Rd #9",
      "city": "Minneapolis",
      "firstName": "Skye",
      "lastName": "Fillingim",
      "state": "MN",
      "zip": 55401
    },
    {
      "address": "25 Se 176th Pl",
      "city": "Cambridge",
      "firstName": "Luisa",
      "lastName": "Jurney",
      "state": "MA",
      "zip": "02138"
    },
    {
      "address": "2500 Pringle Rd Se #508",
      "city": "Hatfield",
      "firstName": "Britt",
      "lastName": "Galam",
      "state": "PA",
      "zip": 19440
    },
    {
      "address": "251 Park Ave #979",
      "city": "Saratoga",
      "firstName": "Rasheeda",
      "lastName": "Sayaphon",
      "state": "CA",
      "zip": 95070
    },
    {
      "address": "25346 New Rd",
      "city": "New York",
      "firstName": "Haydee",
      "lastName": "Denooyer",
      "state": "NY",
      "zip": 10016
    },
    {
      "address": "25657 Live Oak St",
      "city": "Brooklyn",
      "firstName": "Rhea",
      "lastName": "Aredondo",
      "state": "NY",
      "zip": 11226
    },
    {
      "address": "26 Montgomery St",
      "city": "Atlanta",
      "firstName": "Renea",
      "lastName": "Monterrubio",
      "state": "GA",
      "zip": 30328
    },
    {
      "address": "2664 Lewis Rd",
      "city": "Littleton",
      "firstName": "Carmelina",
      "lastName": "Lindall",
      "state": "CO",
      "zip": 80126
    },
    {
      "address": "26659 N 13th St",
      "city": "Costa Mesa",
      "firstName": "Stevie",
      "lastName": "Westerbeck",
      "state": "CA",
      "zip": 92626
    },
    {
      "address": "26849 Jefferson Hwy",
      "city": "Rolling Meadows",
      "firstName": "Cassi",
      "lastName": "Wildfong",
      "state": "IL",
      "zip": 60008
    },
    {
      "address": "2726 Charcot Ave",
      "city": "Paterson",
      "firstName": "Rolland",
      "lastName": "Francescon",
      "state": "NJ",
      "zip": "07501"
    },
    {
      "address": "2737 Pistorio Rd #9230",
      "city": "London",
      "firstName": "Tamar",
      "lastName": "Hoogland",
      "state": "OH",
      "zip": 43140
    },
    {
      "address": "2742 Distribution Way",
      "city": "New York",
      "firstName": "Alishia",
      "lastName": "Sergi",
      "state": "NY",
      "zip": 10025
    },
    {
      "address": "2759 Livingston Ave",
      "city": "Memphis",
      "firstName": "Glenna",
      "lastName": "Slayton",
      "state": "TN",
      "zip": 38118
    },
    {
      "address": "278 Bayview Ave",
      "city": "Milan",
      "firstName": "Quentin",
      "lastName": "Swayze",
      "state": "MI",
      "zip": 48160
    },
    {
      "address": "27846 Lafayette Ave",
      "city": "Oak Hill",
      "firstName": "Hoa",
      "lastName": "Sarao",
      "state": "FL",
      "zip": 32759
    },
    {
      "address": "28 S 7th St #2824",
      "city": "Englewood",
      "firstName": "Arthur",
      "lastName": "Farrow",
      "state": "NJ",
      "zip": "07631"
    },
    {
      "address": "2845 Boulder Crescent St",
      "city": "Cleveland",
      "firstName": "Kattie",
      "lastName": "Vonasek",
      "state": "OH",
      "zip": 44103
    },
    {
      "address": "2853 S Central Expy",
      "city": "Glen Burnie",
      "firstName": "Ilene",
      "lastName": "Eroman",
      "state": "MD",
      "zip": 21061
    },
    {
      "address": "287 Youngstown Warren Rd",
      "city": "Hampstead",
      "firstName": "Sylvia",
      "lastName": "Cousey",
      "state": "MD",
      "zip": 21074
    },
    {
      "address": "2881 Lewis Rd",
      "city": "Prineville",
      "firstName": "Youlanda",
      "lastName": "Schemmer",
      "state": "OR",
      "zip": 97754
    },
    {
      "address": "2887 Knowlton St #5435",
      "city": "Berkeley",
      "firstName": "Joesph",
      "lastName": "Degonia",
      "state": "CA",
      "zip": 94710
    },
    {
      "address": "29 Cherry St #7073",
      "city": "Des Moines",
      "firstName": "Glenn",
      "lastName": "Berray",
      "state": "IA",
      "zip": 50315
    },
    {
      "address": "2972 Lafayette Ave",
      "city": "Gardena",
      "firstName": "Rima",
      "lastName": "Bevelacqua",
      "state": "CA",
      "zip": 90248
    },
    {
      "address": "3 Aspen St",
      "city": "Worcester",
      "firstName": "Donte",
      "lastName": "Kines",
      "state": "MA",
      "zip": "01602"
    },
    {
      "address": "3 Elmwood Dr",
      "city": "Beaverton",
      "firstName": "Karan",
      "lastName": "Karpin",
      "state": "OR",
      "zip": 97005
    },
    {
      "address": "3 Fort Worth Ave",
      "city": "Philadelphia",
      "firstName": "Tyra",
      "lastName": "Shields",
      "state": "PA",
      "zip": 19106
    },
    {
      "address": "3 Lawton St",
      "city": "New York",
      "firstName": "Cyril",
      "lastName": "Daufeldt",
      "state": "NY",
      "zip": 10013
    },
    {
      "address": "3 Mcauley Dr",
      "city": "Ashland",
      "firstName": "Simona",
      "lastName": "Morasca",
      "state": "OH",
      "zip": 44805
    },
    {
      "address": "3 N Groesbeck Hwy",
      "city": "Toledo",
      "firstName": "Rickie",
      "lastName": "Plumer",
      "state": "OH",
      "zip": 43613
    },
    {
      "address": "3 Railway Ave #75",
      "city": "Little Falls",
      "firstName": "Heike",
      "lastName": "Berganza",
      "state": "NJ",
      "zip": "07424"
    },
    {
      "address": "3 Secor Rd",
      "city": "New Orleans",
      "firstName": "Arlene",
      "lastName": "Klusman",
      "state": "LA",
      "zip": 70112
    },
    {
      "address": "3 State Route 35 S",
      "city": "Paramus",
      "firstName": "Nelida",
      "lastName": "Sawchuk",
      "state": "NJ",
      "zip": "07652"
    },
    {
      "address": "30 W 80th St #1995",
      "city": "San Carlos",
      "firstName": "Bobbye",
      "lastName": "Rhym",
      "state": "CA",
      "zip": 94070
    },
    {
      "address": "303 N Radcliffe St",
      "city": "Hilo",
      "firstName": "Novella",
      "lastName": "Degroot",
      "state": "HI",
      "zip": 96720
    },
    {
      "address": "30553 Washington Rd",
      "city": "Plainfield",
      "firstName": "Becky",
      "lastName": "Mirafuentes",
      "state": "NJ",
      "zip": "07062"
    },
    {
      "address": "31 Douglas Blvd #950",
      "city": "Clovis",
      "firstName": "Devorah",
      "lastName": "Chickering",
      "state": "NM",
      "zip": 88101
    },
    {
      "address": "3125 Packer Ave #9851",
      "city": "Austin",
      "firstName": "Mariann",
      "lastName": "Bilden",
      "state": "TX",
      "zip": 78753
    },
    {
      "address": "3158 Runamuck Pl",
      "city": "Round Rock",
      "firstName": "Xochitl",
      "lastName": "Discipio",
      "state": "TX",
      "zip": 78664
    },
    {
      "address": "3196 S Rider Trl",
      "city": "Stockton",
      "firstName": "Alyce",
      "lastName": "Arias",
      "state": "CA",
      "zip": 95207
    },
    {
      "address": "3211 E Northeast Loop",
      "city": "Tampa",
      "firstName": "Jenelle",
      "lastName": "Regusters",
      "state": "FL",
      "zip": 33619
    },
    {
      "address": "322 New Horizon Blvd",
      "city": "Milwaukee",
      "firstName": "Gladys",
      "lastName": "Rim",
      "state": "WI",
      "zip": 53207
    },
    {
      "address": "326 E Main St #6496",
      "city": "Thousand Oaks",
      "firstName": "Melodie",
      "lastName": "Knipp",
      "state": "CA",
      "zip": 91362
    },
    {
      "address": "3270 Dequindre Rd",
      "city": "Deer Park",
      "firstName": "Gwenn",
      "lastName": "Suffield",
      "state": "NY",
      "zip": 11729
    },
    {
      "address": "3273 State St",
      "city": "Middlesex",
      "firstName": "Alisha",
      "lastName": "Slusarski",
      "state": "NJ",
      "zip": "08846"
    },
    {
      "address": "32820 Corkwood Rd",
      "city": "Newark",
      "firstName": "Lynelle",
      "lastName": "Auber",
      "state": "NJ",
      "zip": "07104"
    },
    {
      "address": "32860 Sierra Rd",
      "city": "Miami",
      "firstName": "Tiffiny",
      "lastName": "Steffensmeier",
      "state": "FL",
      "zip": 33133
    },
    {
      "address": "33 Lewis Rd #46",
      "city": "Burlington",
      "firstName": "Deandrea",
      "lastName": "Hughey",
      "state": "NC",
      "zip": 27215
    },
    {
      "address": "33 N Michigan Ave",
      "city": "Green Bay",
      "firstName": "Kate",
      "lastName": "Keneipp",
      "state": "WI",
      "zip": 54301
    },
    {
      "address": "33 State St",
      "city": "Abilene",
      "firstName": "Lilli",
      "lastName": "Scriven",
      "state": "TX",
      "zip": 79601
    },
    {
      "address": "3305 Nabell Ave #679",
      "city": "New York",
      "firstName": "Tawna",
      "lastName": "Buvens",
      "state": "NY",
      "zip": 10009
    },
    {
      "address": "3338 A Lockport Pl #6",
      "city": "Margate City",
      "firstName": "Catalina",
      "lastName": "Tillotson",
      "state": "NJ",
      "zip": "08402"
    },
    {
      "address": "3381 E 40th Ave",
      "city": "Passaic",
      "firstName": "Leonora",
      "lastName": "Mauson",
      "state": "NJ",
      "zip": "07055"
    },
    {
      "address": "3387 Ryan Dr",
      "city": "Hanover",
      "firstName": "Lashaunda",
      "lastName": "Lizama",
      "state": "MD",
      "zip": 21076
    },
    {
      "address": "34 Center St",
      "city": "Hamilton",
      "firstName": "Donette",
      "lastName": "Foller",
      "state": "OH",
      "zip": 45011
    },
    {
      "address": "34 Raritan Center Pky",
      "city": "Bellflower",
      "firstName": "Merissa",
      "lastName": "Tomblin",
      "state": "CA",
      "zip": 90706
    },
    {
      "address": "34 Saint George Ave #2",
      "city": "Bangor",
      "firstName": "Goldie",
      "lastName": "Schirpke",
      "state": "ME",
      "zip": "04401"
    },
    {
      "address": "3424 29th St Se",
      "city": "Kerrville",
      "firstName": "Ruthann",
      "lastName": "Keener",
      "state": "TX",
      "zip": 78028
    },
    {
      "address": "347 Chestnut St",
      "city": "Peoria",
      "firstName": "Helene",
      "lastName": "Rodenberger",
      "state": "AZ",
      "zip": 85381
    },
    {
      "address": "35 E Main St #43",
      "city": "Elk Grove Village",
      "firstName": "Joni",
      "lastName": "Breland",
      "state": "IL",
      "zip": 60007
    },
    {
      "address": "35433 Blake St #588",
      "city": "Gardena",
      "firstName": "Lizbeth",
      "lastName": "Kohl",
      "state": "CA",
      "zip": 90248
    },
    {
      "address": "36 Enterprise St Se",
      "city": "Richland",
      "firstName": "Laurel",
      "lastName": "Pagliuca",
      "state": "WA",
      "zip": 99352
    },
    {
      "address": "36 Lancaster Dr Se",
      "city": "Pearl",
      "firstName": "Billye",
      "lastName": "Miro",
      "state": "MS",
      "zip": 39208
    },
    {
      "address": "366 South Dr",
      "city": "Las Cruces",
      "firstName": "Francine",
      "lastName": "Vocelka",
      "state": "NM",
      "zip": 88011
    },
    {
      "address": "369 Latham St #500",
      "city": "Saint Louis",
      "firstName": "Kasandra",
      "lastName": "Semidey",
      "state": "MO",
      "zip": 63102
    },
    {
      "address": "37 Alabama Ave",
      "city": "Evanston",
      "firstName": "Lai",
      "lastName": "Gato",
      "state": "IL",
      "zip": 60201
    },
    {
      "address": "37 N Elm St #916",
      "city": "Tacoma",
      "firstName": "Alex",
      "lastName": "Loader",
      "state": "WA",
      "zip": 98409
    },
    {
      "address": "3717 Hamann Industrial Pky",
      "city": "San Francisco",
      "firstName": "Stephaine",
      "lastName": "Vinning",
      "state": "CA",
      "zip": 94104
    },
    {
      "address": "3718 S Main St",
      "city": "New Orleans",
      "firstName": "Terrilyn",
      "lastName": "Rodeigues",
      "state": "LA",
      "zip": 70130
    },
    {
      "address": "37275 St  Rt 17m M",
      "city": "Middle Island",
      "firstName": "Abel",
      "lastName": "Maclead",
      "state": "NY",
      "zip": 11953
    },
    {
      "address": "3732 Sherman Ave",
      "city": "Bridgewater",
      "firstName": "Portia",
      "lastName": "Stimmel",
      "state": "NJ",
      "zip": "08807"
    },
    {
      "address": "3777 E Richmond St #900",
      "city": "Akron",
      "firstName": "Stephen",
      "lastName": "Emigh",
      "state": "OH",
      "zip": 44302
    },
    {
      "address": "37855 Nolan Rd",
      "city": "Bangor",
      "firstName": "Jolanda",
      "lastName": "Hanafan",
      "state": "ME",
      "zip": "04401"
    },
    {
      "address": "38 Pleasant Hill Rd",
      "city": "Hayward",
      "firstName": "Gayla",
      "lastName": "Schnitzler",
      "state": "CA",
      "zip": 94545
    },
    {
      "address": "38062 E Main St",
      "city": "New York",
      "firstName": "Justine",
      "lastName": "Mugnolo",
      "state": "NY",
      "zip": 10048
    },
    {
      "address": "3829 Ventura Blvd",
      "city": "Butte",
      "firstName": "Raina",
      "lastName": "Brachle",
      "state": "MT",
      "zip": 59701
    },
    {
      "address": "383 Gunderman Rd #197",
      "city": "Coatesville",
      "firstName": "Freeman",
      "lastName": "Gochal",
      "state": "PA",
      "zip": 19320
    },
    {
      "address": "386 9th Ave N",
      "city": "Conroe",
      "firstName": "Bernardo",
      "lastName": "Figeroa",
      "state": "TX",
      "zip": 77301
    },
    {
      "address": "38773 Gravois Ave",
      "city": "Cheyenne",
      "firstName": "Mona",
      "lastName": "Delasancha",
      "state": "WY",
      "zip": 82001
    },
    {
      "address": "3882 W Congress St #799",
      "city": "Los Angeles",
      "firstName": "Filiberto",
      "lastName": "Tawil",
      "state": "CA",
      "zip": 90016
    },
    {
      "address": "38938 Park Blvd",
      "city": "Boston",
      "firstName": "Jina",
      "lastName": "Briddick",
      "state": "MA",
      "zip": "02128"
    },
    {
      "address": "39 Franklin Ave",
      "city": "Richland",
      "firstName": "Ettie",
      "lastName": "Hoopengardner",
      "state": "WA",
      "zip": 99352
    },
    {
      "address": "39 Moccasin Dr",
      "city": "San Francisco",
      "firstName": "Tarra",
      "lastName": "Nachor",
      "state": "CA",
      "zip": 94104
    },
    {
      "address": "39 S 7th St",
      "city": "Tullahoma",
      "firstName": "Lorrie",
      "lastName": "Nestle",
      "state": "TN",
      "zip": 37388
    },
    {
      "address": "393 Hammond Dr",
      "city": "Lafayette",
      "firstName": "Cordelia",
      "lastName": "Storment",
      "state": "LA",
      "zip": 70506
    },
    {
      "address": "393 Lafayette Ave",
      "city": "Richmond",
      "firstName": "Jerry",
      "lastName": "Dallen",
      "state": "VA",
      "zip": 23219
    },
    {
      "address": "394 Manchester Blvd",
      "city": "Rockford",
      "firstName": "Fletcher",
      "lastName": "Flosi",
      "state": "IL",
      "zip": 61109
    },
    {
      "address": "3943 N Highland Ave",
      "city": "Lancaster",
      "firstName": "Jesusita",
      "lastName": "Flister",
      "state": "PA",
      "zip": 17601
    },
    {
      "address": "395 S 6th St #2",
      "city": "El Cajon",
      "firstName": "Vincenza",
      "lastName": "Zepp",
      "state": "CA",
      "zip": 92020
    },
    {
      "address": "3958 S Dupont Hwy #7",
      "city": "Ramsey",
      "firstName": "Eladia",
      "lastName": "Saulter",
      "state": "NJ",
      "zip": "07446"
    },
    {
      "address": "3989 Portage Tr",
      "city": "Escondido",
      "firstName": "Cristy",
      "lastName": "Lother",
      "state": "CA",
      "zip": 92025
    },
    {
      "address": "4 10th St W",
      "city": "High Point",
      "firstName": "Rosio",
      "lastName": "Cork",
      "state": "NC",
      "zip": 27263
    },
    {
      "address": "4 58th St #3519",
      "city": "Scottsdale",
      "firstName": "Herminia",
      "lastName": "Nicolozakes",
      "state": "AZ",
      "zip": 85254
    },
    {
      "address": "4 B Blue Ridge Blvd",
      "city": "Brighton",
      "firstName": "Josephine",
      "lastName": "Darakjy",
      "state": "MI",
      "zip": 48116
    },
    {
      "address": "4 Bloomfield Ave",
      "city": "Irving",
      "firstName": "Gearldine",
      "lastName": "Gellinger",
      "state": "TX",
      "zip": 75061
    },
    {
      "address": "4 Carroll St",
      "city": "North Attleboro",
      "firstName": "Corinne",
      "lastName": "Loder",
      "state": "MA",
      "zip": "02760"
    },
    {
      "address": "4 Cowesett Ave",
      "city": "Kearny",
      "firstName": "Tasia",
      "lastName": "Andreason",
      "state": "NJ",
      "zip": "07032"
    },
    {
      "address": "4 E Colonial Dr",
      "city": "La Mesa",
      "firstName": "Raul",
      "lastName": "Upthegrove",
      "state": "CA",
      "zip": 91942
    },
    {
      "address": "4 Iwaena St",
      "city": "Baltimore",
      "firstName": "Eden",
      "lastName": "Jayson",
      "state": "MD",
      "zip": 21202
    },
    {
      "address": "4 Kohler Memorial Dr",
      "city": "Brooklyn",
      "firstName": "Barbra",
      "lastName": "Adkin",
      "state": "NY",
      "zip": 11230
    },
    {
      "address": "4 Nw 12th St #3849",
      "city": "Madison",
      "firstName": "Cecilia",
      "lastName": "Colaizzo",
      "state": "WI",
      "zip": 53717
    },
    {
      "address": "4 Otis St",
      "city": "Van Nuys",
      "firstName": "Shenika",
      "lastName": "Seewald",
      "state": "CA",
      "zip": 91405
    },
    {
      "address": "4 Ralph Ct",
      "city": "Dunellen",
      "firstName": "Albina",
      "lastName": "Glick",
      "state": "NJ",
      "zip": "08812"
    },
    {
      "address": "4 S Washington Ave",
      "city": "San Bernardino",
      "firstName": "Antione",
      "lastName": "Onofrio",
      "state": "CA",
      "zip": 92410
    },
    {
      "address": "4 Stovall St #72",
      "city": "Union City",
      "firstName": "Cecil",
      "lastName": "Lapage",
      "state": "NJ",
      "zip": "07087"
    },
    {
      "address": "4 Warehouse Point Rd #7",
      "city": "Chicago",
      "firstName": "Marti",
      "lastName": "Maybury",
      "state": "IL",
      "zip": 60638
    },
    {
      "address": "4 Webbs Chapel Rd",
      "city": "Boulder",
      "firstName": "Alease",
      "lastName": "Buemi",
      "state": "CO",
      "zip": 80303
    },
    {
      "address": "40 9th Ave Sw #91",
      "city": "Waterford",
      "firstName": "Cherry",
      "lastName": "Lietz",
      "state": "MI",
      "zip": 48329
    },
    {
      "address": "40 Cambridge Ave",
      "city": "Madison",
      "firstName": "Janey",
      "lastName": "Gabisi",
      "state": "WI",
      "zip": 53715
    },
    {
      "address": "406 Main St",
      "city": "Somerville",
      "firstName": "Candida",
      "lastName": "Corbley",
      "state": "NJ",
      "zip": "08876"
    },
    {
      "address": "41 Steel Ct",
      "city": "Northfield",
      "firstName": "Rodolfo",
      "lastName": "Butzen",
      "state": "MN",
      "zip": 55057
    },
    {
      "address": "4119 Metropolitan Dr",
      "city": "Los Angeles",
      "firstName": "Cristal",
      "lastName": "Samara",
      "state": "CA",
      "zip": 90021
    },
    {
      "address": "422 E 21st St",
      "city": "Syracuse",
      "firstName": "Yolando",
      "lastName": "Luczki",
      "state": "NY",
      "zip": 13214
    },
    {
      "address": "4252 N Washington Ave #9",
      "city": "Kennedale",
      "firstName": "Barrett",
      "lastName": "Toyama",
      "state": "TX",
      "zip": 76060
    },
    {
      "address": "426 Wolf St",
      "city": "Metairie",
      "firstName": "Solange",
      "lastName": "Shinko",
      "state": "LA",
      "zip": 70002
    },
    {
      "address": "42744 Hamann Industrial Pky #82",
      "city": "Miami",
      "firstName": "Theodora",
      "lastName": "Restrepo",
      "state": "FL",
      "zip": 33136
    },
    {
      "address": "42754 S Ash Ave",
      "city": "Buffalo",
      "firstName": "Helga",
      "lastName": "Fredicks",
      "state": "NY",
      "zip": 14228
    },
    {
      "address": "4284 Dorigo Ln",
      "city": "Chicago",
      "firstName": "Viva",
      "lastName": "Toelkes",
      "state": "IL",
      "zip": 60647
    },
    {
      "address": "429 Tiger Ln",
      "city": "Beverly Hills",
      "firstName": "Chau",
      "lastName": "Kitzman",
      "state": "CA",
      "zip": 90212
    },
    {
      "address": "43 Huey P Long Ave",
      "city": "Lafayette",
      "firstName": "Kayleigh",
      "lastName": "Lace",
      "state": "LA",
      "zip": 70508
    },
    {
      "address": "433 Westminster Blvd #590",
      "city": "Roseville",
      "firstName": "Lashon",
      "lastName": "Vizarro",
      "state": "CA",
      "zip": 95661
    },
    {
      "address": "43496 Commercial Dr #29",
      "city": "Cherry Hill",
      "firstName": "Alpha",
      "lastName": "Palaia",
      "state": "NJ",
      "zip": "08003"
    },
    {
      "address": "4379 Highway 116",
      "city": "Philadelphia",
      "firstName": "Franklyn",
      "lastName": "Emard",
      "state": "PA",
      "zip": 19103
    },
    {
      "address": "44 58th St",
      "city": "Wheeling",
      "firstName": "Jennifer",
      "lastName": "Fallick",
      "state": "IL",
      "zip": 60090
    },
    {
      "address": "44 W 4th St",
      "city": "Staten Island",
      "firstName": "Timothy",
      "lastName": "Mulqueen",
      "state": "NY",
      "zip": 10309
    },
    {
      "address": "4441 Point Term Mkt",
      "city": "Philadelphia",
      "firstName": "Vincent",
      "lastName": "Meinerding",
      "state": "PA",
      "zip": 19143
    },
    {
      "address": "4486 W O St #1",
      "city": "New York",
      "firstName": "Brock",
      "lastName": "Bolognia",
      "state": "NY",
      "zip": 10003
    },
    {
      "address": "45 2nd Ave #9759",
      "city": "Atlanta",
      "firstName": "Sarah",
      "lastName": "Candlish",
      "state": "GA",
      "zip": 30328
    },
    {
      "address": "45 E Acacia Ct",
      "city": "Chicago",
      "firstName": "Erick",
      "lastName": "Nievas",
      "state": "IL",
      "zip": 60624
    },
    {
      "address": "45 E Liberty St",
      "city": "Ridgefield Park",
      "firstName": "Ernie",
      "lastName": "Stenseth",
      "state": "NJ",
      "zip": "07660"
    },
    {
      "address": "4545 Courthouse Rd",
      "city": "Westbury",
      "firstName": "Tonette",
      "lastName": "Wenner",
      "state": "NY",
      "zip": 11590
    },
    {
      "address": "455 N Main Ave",
      "city": "Garden City",
      "firstName": "Gregoria",
      "lastName": "Pawlowicz",
      "state": "NY",
      "zip": 11530
    },
    {
      "address": "461 Prospect Pl #316",
      "city": "Euless",
      "firstName": "Myra",
      "lastName": "Munns",
      "state": "TX",
      "zip": 76040
    },
    {
      "address": "46314 Route 130",
      "city": "Bridgeport",
      "firstName": "Teddy",
      "lastName": "Pedrozo",
      "state": "CT",
      "zip": "06610"
    },
    {
      "address": "4646 Kaahumanu St",
      "city": "Hackensack",
      "firstName": "Ty",
      "lastName": "Smith",
      "state": "NJ",
      "zip": "07601"
    },
    {
      "address": "4671 Alemany Blvd",
      "city": "Jersey City",
      "firstName": "Merlyn",
      "lastName": "Lawler",
      "state": "NJ",
      "zip": "07304"
    },
    {
      "address": "469 Outwater Ln",
      "city": "San Diego",
      "firstName": "Dorothy",
      "lastName": "Chesterfield",
      "state": "CA",
      "zip": 92126
    },
    {
      "address": "47154 Whipple Ave Nw",
      "city": "Gardena",
      "firstName": "Stephaine",
      "lastName": "Barfield",
      "state": "CA",
      "zip": 90247
    },
    {
      "address": "47565 W Grand Ave",
      "city": "Newark",
      "firstName": "Delisa",
      "lastName": "Crupi",
      "state": "NJ",
      "zip": "07105"
    },
    {
      "address": "47857 Coney Island Ave",
      "city": "Clinton",
      "firstName": "Loreta",
      "lastName": "Timenez",
      "state": "MD",
      "zip": 20735
    },
    {
      "address": "47939 Porter Ave",
      "city": "Gardena",
      "firstName": "Benton",
      "lastName": "Skursky",
      "state": "CA",
      "zip": 90248
    },
    {
      "address": "48 Lenox St",
      "city": "Fairfax",
      "firstName": "Taryn",
      "lastName": "Moyd",
      "state": "VA",
      "zip": 22030
    },
    {
      "address": "48 Stratford Ave",
      "city": "Pomona",
      "firstName": "Justine",
      "lastName": "Ferrario",
      "state": "CA",
      "zip": 91768
    },
    {
      "address": "4800 Black Horse Pike",
      "city": "Burlingame",
      "firstName": "Tammara",
      "lastName": "Wardrip",
      "state": "CA",
      "zip": 94010
    },
    {
      "address": "481 W Lemon St",
      "city": "Middleboro",
      "firstName": "Beatriz",
      "lastName": "Corrington",
      "state": "MA",
      "zip": "02346"
    },
    {
      "address": "49 N Mays St",
      "city": "Broussard",
      "firstName": "Jutta",
      "lastName": "Amyot",
      "state": "LA",
      "zip": 70518
    },
    {
      "address": "4923 Carey Ave",
      "city": "Saint Louis",
      "firstName": "Benedict",
      "lastName": "Sama",
      "state": "MO",
      "zip": 63104
    },
    {
      "address": "4940 Pulaski Park Dr",
      "city": "Portland",
      "firstName": "Nieves",
      "lastName": "Gotter",
      "state": "OR",
      "zip": 97202
    },
    {
      "address": "49440 Dearborn St",
      "city": "Norwalk",
      "firstName": "Zona",
      "lastName": "Colla",
      "state": "CT",
      "zip": "06854"
    },
    {
      "address": "5 Boston Ave #88",
      "city": "Sioux Falls",
      "firstName": "Sage",
      "lastName": "Wieser",
      "state": "SD",
      "zip": 57105
    },
    {
      "address": "5 Cabot Rd",
      "city": "Mc Lean",
      "firstName": "Lavonna",
      "lastName": "Wolny",
      "state": "VA",
      "zip": 22102
    },
    {
      "address": "5 E Truman Rd",
      "city": "Abilene",
      "firstName": "Glory",
      "lastName": "Schieler",
      "state": "TX",
      "zip": 79602
    },
    {
      "address": "5 Elmwood Park Blvd",
      "city": "Biloxi",
      "firstName": "Leonida",
      "lastName": "Gobern",
      "state": "MS",
      "zip": 39530
    },
    {
      "address": "5 Green Pond Rd #4",
      "city": "Southampton",
      "firstName": "Garry",
      "lastName": "Keetch",
      "state": "PA",
      "zip": 18966
    },
    {
      "address": "5 Harrison Rd",
      "city": "New York",
      "firstName": "Fausto",
      "lastName": "Agramonte",
      "state": "NY",
      "zip": 10038
    },
    {
      "address": "5 Little River Tpke",
      "city": "Wilmington",
      "firstName": "Katina",
      "lastName": "Polidori",
      "state": "MA",
      "zip": "01887"
    },
    {
      "address": "5 N Cleveland Massillon Rd",
      "city": "Thousand Oaks",
      "firstName": "Shawna",
      "lastName": "Palaspas",
      "state": "CA",
      "zip": 91362
    },
    {
      "address": "5 S Colorado Blvd #449",
      "city": "Bothell",
      "firstName": "Johnna",
      "lastName": "Engelberg",
      "state": "WA",
      "zip": 98021
    },
    {
      "address": "5 Tomahawk Dr",
      "city": "Los Angeles",
      "firstName": "Kanisha",
      "lastName": "Waycott",
      "state": "CA",
      "zip": 90006
    },
    {
      "address": "5 W 7th St",
      "city": "Parkville",
      "firstName": "Annelle",
      "lastName": "Tagala",
      "state": "MD",
      "zip": 21234
    },
    {
      "address": "5 Washington St #1",
      "city": "Roseville",
      "firstName": "Thaddeus",
      "lastName": "Ankeny",
      "state": "CA",
      "zip": 95678
    },
    {
      "address": "5 Williams St",
      "city": "Johnston",
      "firstName": "Caitlin",
      "lastName": "Julia",
      "state": "RI",
      "zip": "02919"
    },
    {
      "address": "50 E Wacker Dr",
      "city": "Bridgewater",
      "firstName": "Jettie",
      "lastName": "Mconnell",
      "state": "NJ",
      "zip": "08807"
    },
    {
      "address": "501 N 19th Ave",
      "city": "Cherry Hill",
      "firstName": "Lizette",
      "lastName": "Stem",
      "state": "NJ",
      "zip": "08002"
    },
    {
      "address": "50126 N Plankinton Ave",
      "city": "Longwood",
      "firstName": "Shawnda",
      "lastName": "Yori",
      "state": "FL",
      "zip": 32750
    },
    {
      "address": "506 S Hacienda Dr",
      "city": "Atlantic City",
      "firstName": "An",
      "lastName": "Fritz",
      "state": "NJ",
      "zip": "08401"
    },
    {
      "address": "51120 State Route 18",
      "city": "Salt Lake City",
      "firstName": "Lonny",
      "lastName": "Weglarz",
      "state": "UT",
      "zip": 84115
    },
    {
      "address": "5161 Dorsett Rd",
      "city": "Homestead",
      "firstName": "Pamella",
      "lastName": "Schmierer",
      "state": "FL",
      "zip": 33030
    },
    {
      "address": "5221 Bear Valley Rd",
      "city": "Nashville",
      "firstName": "Casie",
      "lastName": "Good",
      "state": "TN",
      "zip": 37211
    },
    {
      "address": "523 Marquette Ave",
      "city": "Concord",
      "firstName": "Annabelle",
      "lastName": "Boord",
      "state": "MA",
      "zip": "01742"
    },
    {
      "address": "524 Louisiana Ave Nw",
      "city": "San Leandro",
      "firstName": "Louisa",
      "lastName": "Cronauer",
      "state": "CA",
      "zip": 94577
    },
    {
      "address": "52777 Leaders Heights Rd",
      "city": "Ontario",
      "firstName": "Lindsey",
      "lastName": "Dilello",
      "state": "CA",
      "zip": 91761
    },
    {
      "address": "53 W Carey St",
      "city": "Port Jervis",
      "firstName": "Ciara",
      "lastName": "Ventura",
      "state": "NY",
      "zip": 12771
    },
    {
      "address": "53075 Sw 152nd Ter #615",
      "city": "Monroe Township",
      "firstName": "Jamal",
      "lastName": "Vanausdal",
      "state": "NJ",
      "zip": "08831"
    },
    {
      "address": "5384 Southwyck Blvd",
      "city": "Douglasville",
      "firstName": "Belen",
      "lastName": "Strassner",
      "state": "GA",
      "zip": 30135
    },
    {
      "address": "539 Coldwater Canyon Ave",
      "city": "Bloomfield",
      "firstName": "Truman",
      "lastName": "Feichtner",
      "state": "NJ",
      "zip": "07003"
    },
    {
      "address": "54169 N Main St",
      "city": "Massapequa",
      "firstName": "Theola",
      "lastName": "Frey",
      "state": "NY",
      "zip": 11758
    },
    {
      "address": "55 Hawthorne Blvd",
      "city": "Lafayette",
      "firstName": "Willodean",
      "lastName": "Konopacki",
      "state": "LA",
      "zip": 70506
    },
    {
      "address": "55 Riverside Ave",
      "city": "Indianapolis",
      "firstName": "Malinda",
      "lastName": "Hochard",
      "state": "IN",
      "zip": 46202
    },
    {
      "address": "55262 N French Rd",
      "city": "Indianapolis",
      "firstName": "Reita",
      "lastName": "Leto",
      "state": "IN",
      "zip": 46240
    },
    {
      "address": "555 Main St",
      "city": "Erie",
      "firstName": "Edna",
      "lastName": "Miceli",
      "state": "PA",
      "zip": 16502
    },
    {
      "address": "55713 Lake City Hwy",
      "city": "South Bend",
      "firstName": "Alline",
      "lastName": "Jeanty",
      "state": "IN",
      "zip": 46601
    },
    {
      "address": "55892 Jacksonville Rd",
      "city": "Owings Mills",
      "firstName": "Glory",
      "lastName": "Kulzer",
      "state": "MD",
      "zip": 21117
    },
    {
      "address": "56 E Morehead St",
      "city": "Laredo",
      "firstName": "Cammy",
      "lastName": "Albares",
      "state": "TX",
      "zip": 78045
    },
    {
      "address": "560 Civic Center Dr",
      "city": "Ann Arbor",
      "firstName": "Chaya",
      "lastName": "Malvin",
      "state": "MI",
      "zip": 48103
    },
    {
      "address": "57 Haven Ave #90",
      "city": "Southfield",
      "firstName": "Deonna",
      "lastName": "Kippley",
      "state": "MI",
      "zip": 48075
    },
    {
      "address": "57254 Brickell Ave #372",
      "city": "Worcester",
      "firstName": "Lucy",
      "lastName": "Treston",
      "state": "MA",
      "zip": "01602"
    },
    {
      "address": "577 Parade St",
      "city": "South San Francisco",
      "firstName": "Mozell",
      "lastName": "Pelkowski",
      "state": "CA",
      "zip": 94080
    },
    {
      "address": "59 N Groesbeck Hwy",
      "city": "Austin",
      "firstName": "Cecily",
      "lastName": "Hollack",
      "state": "TX",
      "zip": 78731
    },
    {
      "address": "59 Shady Ln #53",
      "city": "Milwaukee",
      "firstName": "Maurine",
      "lastName": "Yglesias",
      "state": "WI",
      "zip": 53214
    },
    {
      "address": "596 Santa Maria Ave #7913",
      "city": "Mesquite",
      "firstName": "Amie",
      "lastName": "Perigo",
      "state": "TX",
      "zip": 75150
    },
    {
      "address": "598 43rd St",
      "city": "Beverly Hills",
      "firstName": "Louvenia",
      "lastName": "Beech",
      "state": "CA",
      "zip": 90210
    },
    {
      "address": "6 Gilson St",
      "city": "Bronx",
      "firstName": "Bok",
      "lastName": "Isaacs",
      "state": "NY",
      "zip": 10468
    },
    {
      "address": "6 Greenleaf Ave",
      "city": "San Jose",
      "firstName": "Veronika",
      "lastName": "Inouye",
      "state": "CA",
      "zip": 95111
    },
    {
      "address": "6 Harry L Dr #6327",
      "city": "Perrysburg",
      "firstName": "Claribel",
      "lastName": "Varriano",
      "state": "OH",
      "zip": 43551
    },
    {
      "address": "6 Kains Ave",
      "city": "Baltimore",
      "firstName": "Laurel",
      "lastName": "Reitler",
      "state": "MD",
      "zip": 21215
    },
    {
      "address": "6 Middlegate Rd #106",
      "city": "San Francisco",
      "firstName": "Norah",
      "lastName": "Waymire",
      "state": "CA",
      "zip": 94107
    },
    {
      "address": "6 Ridgewood Center Dr",
      "city": "Old Forge",
      "firstName": "Loren",
      "lastName": "Asar",
      "state": "PA",
      "zip": 18518
    },
    {
      "address": "6 S 33rd St",
      "city": "Aston",
      "firstName": "Bette",
      "lastName": "Nicka",
      "state": "PA",
      "zip": 19014
    },
    {
      "address": "6 S Broadway St",
      "city": "Cedar Grove",
      "firstName": "Junita",
      "lastName": "Brideau",
      "state": "NJ",
      "zip": "07009"
    },
    {
      "address": "6 Sunrise Ave",
      "city": "Utica",
      "firstName": "Elli",
      "lastName": "Mclaird",
      "state": "NY",
      "zip": 13501
    },
    {
      "address": "6 Van Buren St",
      "city": "Mount Vernon",
      "firstName": "Nana",
      "lastName": "Wrinkles",
      "state": "NY",
      "zip": 10553
    },
    {
      "address": "60 Fillmore Ave",
      "city": "Huntington Beach",
      "firstName": "Joseph",
      "lastName": "Cryer",
      "state": "CA",
      "zip": 92647
    },
    {
      "address": "60 Old Dover Rd",
      "city": "Hialeah",
      "firstName": "Roosevelt",
      "lastName": "Hoffis",
      "state": "FL",
      "zip": 33014
    },
    {
      "address": "60480 Old Us Highway 51",
      "city": "Preston",
      "firstName": "Fernanda",
      "lastName": "Jillson",
      "state": "MD",
      "zip": 21655
    },
    {
      "address": "61 13 Stoneridge #835",
      "city": "Findlay",
      "firstName": "Melissa",
      "lastName": "Wiklund",
      "state": "OH",
      "zip": 45840
    },
    {
      "address": "61047 Mayfield Ave",
      "city": "Brooklyn",
      "firstName": "Shalon",
      "lastName": "Shadrick",
      "state": "NY",
      "zip": 11223
    },
    {
      "address": "61304 N French Rd",
      "city": "Somerset",
      "firstName": "Carmen",
      "lastName": "Sweigard",
      "state": "NJ",
      "zip": "08873"
    },
    {
      "address": "61556 W 20th Ave",
      "city": "Seattle",
      "firstName": "Jani",
      "lastName": "Biddy",
      "state": "WA",
      "zip": 98104
    },
    {
      "address": "617 Nw 36th Ave",
      "city": "Brook Park",
      "firstName": "Galen",
      "lastName": "Cantres",
      "state": "OH",
      "zip": 44142
    },
    {
      "address": "618 W Yakima Ave",
      "city": "Irving",
      "firstName": "Willard",
      "lastName": "Kolmetz",
      "state": "TX",
      "zip": 75062
    },
    {
      "address": "62 Monroe St",
      "city": "Thousand Palms",
      "firstName": "Gail",
      "lastName": "Similton",
      "state": "CA",
      "zip": 92276
    },
    {
      "address": "62 W Austin St",
      "city": "Syosset",
      "firstName": "Sharen",
      "lastName": "Bourbon",
      "state": "NY",
      "zip": 11791
    },
    {
      "address": "6201 S Nevada Ave",
      "city": "Toms River",
      "firstName": "Golda",
      "lastName": "Kaniecki",
      "state": "NJ",
      "zip": "08755"
    },
    {
      "address": "62260 Park Stre",
      "city": "Monroe Township",
      "firstName": "Tegan",
      "lastName": "Arceo",
      "state": "NJ",
      "zip": "08831"
    },
    {
      "address": "627 Walford Ave",
      "city": "Dallas",
      "firstName": "Leatha",
      "lastName": "Hagele",
      "state": "TX",
      "zip": 75227
    },
    {
      "address": "63 E Aurora Dr",
      "city": "Orlando",
      "firstName": "Chauncey",
      "lastName": "Motley",
      "state": "FL",
      "zip": 32804
    },
    {
      "address": "63 Smith Ln #8343",
      "city": "Moss",
      "firstName": "Josphine",
      "lastName": "Villanueva",
      "state": "TN",
      "zip": 38575
    },
    {
      "address": "63381 Jenks Ave",
      "city": "Philadelphia",
      "firstName": "Dierdre",
      "lastName": "Yum",
      "state": "PA",
      "zip": 19134
    },
    {
      "address": "63517 Dupont St",
      "city": "Jackson",
      "firstName": "Roslyn",
      "lastName": "Chavous",
      "state": "MS",
      "zip": 39211
    },
    {
      "address": "636 Commerce Dr #42",
      "city": "Shakopee",
      "firstName": "Matthew",
      "lastName": "Neither",
      "state": "MN",
      "zip": 55379
    },
    {
      "address": "63728 Poway Rd #1",
      "city": "Scranton",
      "firstName": "Jennie",
      "lastName": "Drymon",
      "state": "PA",
      "zip": 18509
    },
    {
      "address": "639 Main St",
      "city": "Anchorage",
      "firstName": "Lenna",
      "lastName": "Paprocki",
      "state": "AK",
      "zip": 99501
    },
    {
      "address": "64 5th Ave #1153",
      "city": "Mc Lean",
      "firstName": "Lisha",
      "lastName": "Centini",
      "state": "VA",
      "zip": 22102
    },
    {
      "address": "64 Lakeview Ave",
      "city": "Beloit",
      "firstName": "Estrella",
      "lastName": "Samu",
      "state": "WI",
      "zip": 53511
    },
    {
      "address": "64 Newman Springs Rd E",
      "city": "Brooklyn",
      "firstName": "France",
      "lastName": "Buzick",
      "state": "NY",
      "zip": 11219
    },
    {
      "address": "649 Tulane Ave",
      "city": "Tulsa",
      "firstName": "Sylvie",
      "lastName": "Ryser",
      "state": "OK",
      "zip": 74105
    },
    {
      "address": "65 Mountain View Dr",
      "city": "Whippany",
      "firstName": "Adell",
      "lastName": "Lipkin",
      "state": "NJ",
      "zip": "07981"
    },
    {
      "address": "65 W Maple Ave",
      "city": "Pearl City",
      "firstName": "Rolande",
      "lastName": "Spickerman",
      "state": "HI",
      "zip": 96782
    },
    {
      "address": "6535 Joyce St",
      "city": "Wichita Falls",
      "firstName": "Alecia",
      "lastName": "Bubash",
      "state": "TX",
      "zip": 76301
    },
    {
      "address": "6538 E Pomona St #60",
      "city": "Indianapolis",
      "firstName": "Raymon",
      "lastName": "Calvaresi",
      "state": "IN",
      "zip": 46222
    },
    {
      "address": "65895 S 16th St",
      "city": "Providence",
      "firstName": "Delmy",
      "lastName": "Ahle",
      "state": "RI",
      "zip": "02909"
    },
    {
      "address": "6649 N Blue Gum St",
      "city": "New Orleans",
      "firstName": "James",
      "lastName": "Butt",
      "state": "LA",
      "zip": 70116
    },
    {
      "address": "6651 Municipal Rd",
      "city": "Houma",
      "firstName": "Larae",
      "lastName": "Gudroe",
      "state": "LA",
      "zip": 70360
    },
    {
      "address": "66552 Malone Rd",
      "city": "Plaistow",
      "firstName": "Dalene",
      "lastName": "Riden",
      "state": "NH",
      "zip": "03865"
    },
    {
      "address": "66697 Park Pl #3224",
      "city": "Riverton",
      "firstName": "Lauran",
      "lastName": "Burnard",
      "state": "WY",
      "zip": 82501
    },
    {
      "address": "669 Packerland Dr #1438",
      "city": "Denver",
      "firstName": "Pamella",
      "lastName": "Fortino",
      "state": "CO",
      "zip": 80212
    },
    {
      "address": "67 E Chestnut Hill Rd",
      "city": "Seattle",
      "firstName": "Dottie",
      "lastName": "Hellickson",
      "state": "WA",
      "zip": 98133
    },
    {
      "address": "67 Rv Cent",
      "city": "Boise",
      "firstName": "Brittni",
      "lastName": "Gillaspie",
      "state": "ID",
      "zip": 83709
    },
    {
      "address": "678 3rd Ave",
      "city": "Miami",
      "firstName": "Lavera",
      "lastName": "Perin",
      "state": "FL",
      "zip": 33196
    },
    {
      "address": "6794 Lake Dr E",
      "city": "Newark",
      "firstName": "Elza",
      "lastName": "Lipke",
      "state": "NJ",
      "zip": "07104"
    },
    {
      "address": "68556 Central Hwy",
      "city": "San Leandro",
      "firstName": "Carma",
      "lastName": "Vanheusen",
      "state": "CA",
      "zip": 94577
    },
    {
      "address": "6882 Torresdale Ave",
      "city": "Columbia",
      "firstName": "Jade",
      "lastName": "Farrar",
      "state": "SC",
      "zip": 29201
    },
    {
      "address": "69 Marquette Ave",
      "city": "Hayward",
      "firstName": "Dominque",
      "lastName": "Dickerson",
      "state": "CA",
      "zip": 94545
    },
    {
      "address": "6916 W Main St",
      "city": "Sacramento",
      "firstName": "Kerry",
      "lastName": "Theodorov",
      "state": "CA",
      "zip": 95827
    },
    {
      "address": "69734 E Carrillo St",
      "city": "Mc Minnville",
      "firstName": "Meaghan",
      "lastName": "Garufi",
      "state": "TN",
      "zip": 37110
    },
    {
      "address": "6980 Dorsett Rd",
      "city": "Abilene",
      "firstName": "Kati",
      "lastName": "Rulapaugh",
      "state": "KS",
      "zip": 67410
    },
    {
      "address": "7 Benton Dr",
      "city": "Honolulu",
      "firstName": "Brandon",
      "lastName": "Callaro",
      "state": "HI",
      "zip": 96819
    },
    {
      "address": "7 Eads St",
      "city": "Chicago",
      "firstName": "Mitsue",
      "lastName": "Tollner",
      "state": "IL",
      "zip": 60632
    },
    {
      "address": "7 Flowers Rd #403",
      "city": "Trenton",
      "firstName": "Daniela",
      "lastName": "Comnick",
      "state": "NJ",
      "zip": "08611"
    },
    {
      "address": "7 S Beverly Dr",
      "city": "Fort Wayne",
      "firstName": "Serina",
      "lastName": "Zagen",
      "state": "IN",
      "zip": 46802
    },
    {
      "address": "7 S San Marcos Rd",
      "city": "New York",
      "firstName": "Mirta",
      "lastName": "Mallett",
      "state": "NY",
      "zip": 10004
    },
    {
      "address": "7 Tarrytown Rd",
      "city": "Cincinnati",
      "firstName": "Gertude",
      "lastName": "Witten",
      "state": "OH",
      "zip": 45217
    },
    {
      "address": "7 W 32nd St",
      "city": "Erie",
      "firstName": "Elly",
      "lastName": "Morocco",
      "state": "PA",
      "zip": 16502
    },
    {
      "address": "7 W Jackson Blvd",
      "city": "San Jose",
      "firstName": "Leota",
      "lastName": "Dilliard",
      "state": "CA",
      "zip": 95111
    },
    {
      "address": "7 W Pinhook Rd",
      "city": "Lynbrook",
      "firstName": "Celeste",
      "lastName": "Korando",
      "state": "NY",
      "zip": 11563
    },
    {
      "address": "7 W Wabansia Ave #227",
      "city": "Orlando",
      "firstName": "Martina",
      "lastName": "Staback",
      "state": "FL",
      "zip": 32822
    },
    {
      "address": "7 West Ave #1",
      "city": "Palatine",
      "firstName": "Geoffrey",
      "lastName": "Acey",
      "state": "IL",
      "zip": 60067
    },
    {
      "address": "70 Euclid Ave #722",
      "city": "Bohemia",
      "firstName": "Lemuel",
      "lastName": "Latzke",
      "state": "NY",
      "zip": 11716
    },
    {
      "address": "70 Mechanic St",
      "city": "Northridge",
      "firstName": "Viola",
      "lastName": "Bitsuie",
      "state": "CA",
      "zip": 91325
    },
    {
      "address": "70 W Main St",
      "city": "Beachwood",
      "firstName": "Lettie",
      "lastName": "Isenhower",
      "state": "OH",
      "zip": 44122
    },
    {
      "address": "70099 E North Ave",
      "city": "Arlington",
      "firstName": "Kristeen",
      "lastName": "Turinetti",
      "state": "TX",
      "zip": 76013
    },
    {
      "address": "701 S Harrison Rd",
      "city": "San Francisco",
      "firstName": "Kallie",
      "lastName": "Blackwood",
      "state": "CA",
      "zip": 94104
    },
    {
      "address": "70295 Pioneer Ct",
      "city": "Brandon",
      "firstName": "Audry",
      "lastName": "Yaw",
      "state": "FL",
      "zip": 33511
    },
    {
      "address": "703 Beville Rd",
      "city": "Opa Locka",
      "firstName": "Ashlyn",
      "lastName": "Pinilla",
      "state": "FL",
      "zip": 33054
    },
    {
      "address": "7061 N 2nd St",
      "city": "Burnsville",
      "firstName": "Quentin",
      "lastName": "Birkner",
      "state": "MN",
      "zip": 55337
    },
    {
      "address": "71 San Mateo Ave",
      "city": "Wayne",
      "firstName": "Marjory",
      "lastName": "Mastella",
      "state": "PA",
      "zip": 19087
    },
    {
      "address": "7116 Western Ave",
      "city": "Dearborn",
      "firstName": "Beckie",
      "lastName": "Silvestrini",
      "state": "MI",
      "zip": 48126
    },
    {
      "address": "7140 University Ave",
      "city": "Rock Springs",
      "firstName": "Natalie",
      "lastName": "Fern",
      "state": "WY",
      "zip": 82901
    },
    {
      "address": "7163 W Clark Rd",
      "city": "Freehold",
      "firstName": "Vi",
      "lastName": "Rentfro",
      "state": "NJ",
      "zip": "07728"
    },
    {
      "address": "72 Beechwood Ter",
      "city": "Chicago",
      "firstName": "Nichelle",
      "lastName": "Meteer",
      "state": "IL",
      "zip": 60657
    },
    {
      "address": "72 Mannix Dr",
      "city": "Cincinnati",
      "firstName": "Laticia",
      "lastName": "Merced",
      "state": "OH",
      "zip": 45203
    },
    {
      "address": "72 Southern Blvd",
      "city": "Mesa",
      "firstName": "Iluminada",
      "lastName": "Ohms",
      "state": "AZ",
      "zip": 85204
    },
    {
      "address": "721 Interstate 45 S",
      "city": "Colorado Springs",
      "firstName": "Jaclyn",
      "lastName": "Bachman",
      "state": "CO",
      "zip": 80919
    },
    {
      "address": "72119 S Walker Ave #63",
      "city": "Anaheim",
      "firstName": "Venita",
      "lastName": "Maillard",
      "state": "CA",
      "zip": 92801
    },
    {
      "address": "7219 Woodfield Rd",
      "city": "Overland Park",
      "firstName": "Dyan",
      "lastName": "Oldroyd",
      "state": "KS",
      "zip": 66204
    },
    {
      "address": "72868 Blackington Ave",
      "city": "Oakland",
      "firstName": "Devora",
      "lastName": "Perez",
      "state": "CA",
      "zip": 94606
    },
    {
      "address": "73 Saint Ann St #86",
      "city": "Reno",
      "firstName": "Clay",
      "lastName": "Hoa",
      "state": "NV",
      "zip": 89502
    },
    {
      "address": "73 Southern Blvd",
      "city": "Philadelphia",
      "firstName": "Ronny",
      "lastName": "Caiafa",
      "state": "PA",
      "zip": 19103
    },
    {
      "address": "73 State Road 434 E",
      "city": "Phoenix",
      "firstName": "Mattie",
      "lastName": "Poquette",
      "state": "AZ",
      "zip": 85013
    },
    {
      "address": "73 W Barstow Ave",
      "city": "Arlington Heights",
      "firstName": "Weldon",
      "lastName": "Acuff",
      "state": "IL",
      "zip": 60004
    },
    {
      "address": "735 Crawford Dr",
      "city": "Anchorage",
      "firstName": "Gail",
      "lastName": "Kitty",
      "state": "AK",
      "zip": 99501
    },
    {
      "address": "74 S Westgate St",
      "city": "Albany",
      "firstName": "Maryann",
      "lastName": "Royster",
      "state": "NY",
      "zip": 12204
    },
    {
      "address": "74 W College St",
      "city": "Boise",
      "firstName": "Vallie",
      "lastName": "Mondella",
      "state": "ID",
      "zip": 83707
    },
    {
      "address": "7422 Martin Ave #8",
      "city": "Toledo",
      "firstName": "Lashawnda",
      "lastName": "Stuer",
      "state": "OH",
      "zip": 43607
    },
    {
      "address": "747 Leonis Blvd",
      "city": "Annandale",
      "firstName": "Malcolm",
      "lastName": "Tromblay",
      "state": "VA",
      "zip": 22003
    },
    {
      "address": "74874 Atlantic Ave",
      "city": "Columbus",
      "firstName": "Ammie",
      "lastName": "Corrio",
      "state": "OH",
      "zip": 43215
    },
    {
      "address": "749 W 18th St #45",
      "city": "Smithfield",
      "firstName": "Lezlie",
      "lastName": "Craghead",
      "state": "NC",
      "zip": 27577
    },
    {
      "address": "74989 Brandon St",
      "city": "Wellsville",
      "firstName": "Moon",
      "lastName": "Parlato",
      "state": "NY",
      "zip": 14895
    },
    {
      "address": "755 Harbor Way",
      "city": "Milwaukee",
      "firstName": "Virgina",
      "lastName": "Tegarden",
      "state": "WI",
      "zip": 53226
    },
    {
      "address": "7563 Cornwall Rd #4462",
      "city": "Denver",
      "firstName": "Felix",
      "lastName": "Hirpara",
      "state": "PA",
      "zip": 17517
    },
    {
      "address": "75684 S Withlapopka Dr #32",
      "city": "Dallas",
      "firstName": "Earleen",
      "lastName": "Mai",
      "state": "TX",
      "zip": 75227
    },
    {
      "address": "75698 N Fiesta Blvd",
      "city": "Orlando",
      "firstName": "Sharika",
      "lastName": "Eanes",
      "state": "FL",
      "zip": 32806
    },
    {
      "address": "759 Eldora St",
      "city": "New Haven",
      "firstName": "Harrison",
      "lastName": "Haufler",
      "state": "CT",
      "zip": "06515"
    },
    {
      "address": "76 Brooks St #9",
      "city": "Flemington",
      "firstName": "Karl",
      "lastName": "Klonowski",
      "state": "NJ",
      "zip": "08822"
    },
    {
      "address": "762 S Main St",
      "city": "Madison",
      "firstName": "Emerson",
      "lastName": "Bowley",
      "state": "WI",
      "zip": 53711
    },
    {
      "address": "76598 Rd  I 95 #1",
      "city": "Denver",
      "firstName": "Virgie",
      "lastName": "Kiel",
      "state": "CO",
      "zip": 80216
    },
    {
      "address": "7667 S Hulen St #42",
      "city": "Yonkers",
      "firstName": "Alaine",
      "lastName": "Bergesen",
      "state": "NY",
      "zip": 10701
    },
    {
      "address": "77 222 Dr",
      "city": "Oroville",
      "firstName": "Mitsue",
      "lastName": "Scipione",
      "state": "CA",
      "zip": 95965
    },
    {
      "address": "77 Massillon Rd #822",
      "city": "Satellite Beach",
      "firstName": "Jerry",
      "lastName": "Zurcher",
      "state": "FL",
      "zip": 32937
    },
    {
      "address": "77132 Coon Rapids Blvd Nw",
      "city": "Conroe",
      "firstName": "Tracey",
      "lastName": "Modzelewski",
      "state": "TX",
      "zip": 77301
    },
    {
      "address": "772 W River Dr",
      "city": "Bloomington",
      "firstName": "Kristofer",
      "lastName": "Bennick",
      "state": "IN",
      "zip": 47404
    },
    {
      "address": "775 W 17th St",
      "city": "San Antonio",
      "firstName": "Valentine",
      "lastName": "Gillian",
      "state": "TX",
      "zip": 78204
    },
    {
      "address": "78 Maryland Dr #146",
      "city": "Denville",
      "firstName": "Catarina",
      "lastName": "Gleich",
      "state": "NJ",
      "zip": "07834"
    },
    {
      "address": "78112 Morris Ave",
      "city": "North Haven",
      "firstName": "Ma",
      "lastName": "Layous",
      "state": "CT",
      "zip": "06473"
    },
    {
      "address": "79 S Howell Ave",
      "city": "Grand Rapids",
      "firstName": "Vilma",
      "lastName": "Berlanga",
      "state": "MI",
      "zip": 49546
    },
    {
      "address": "798 Lund Farm Way",
      "city": "Rockaway",
      "firstName": "Kimbery",
      "lastName": "Madarang",
      "state": "NJ",
      "zip": "07866"
    },
    {
      "address": "8 County Center Dr #647",
      "city": "Boston",
      "firstName": "Oretha",
      "lastName": "Menter",
      "state": "MA",
      "zip": "02210"
    },
    {
      "address": "8 Fair Lawn Ave",
      "city": "Tampa",
      "firstName": "Lorrine",
      "lastName": "Worlds",
      "state": "FL",
      "zip": 33614
    },
    {
      "address": "8 Industry Ln",
      "city": "New York",
      "firstName": "Ozell",
      "lastName": "Shealy",
      "state": "NY",
      "zip": 10002
    },
    {
      "address": "8 Mcarthur Ln",
      "city": "Richboro",
      "firstName": "My",
      "lastName": "Rantanen",
      "state": "PA",
      "zip": 18954
    },
    {
      "address": "8 S Haven St",
      "city": "Daytona Beach",
      "firstName": "Jovita",
      "lastName": "Oles",
      "state": "FL",
      "zip": 32114
    },
    {
      "address": "8 Sheridan Rd",
      "city": "Jersey City",
      "firstName": "Helaine",
      "lastName": "Halter",
      "state": "NJ",
      "zip": "07304"
    },
    {
      "address": "8 Us Highway 22",
      "city": "Colorado Springs",
      "firstName": "Sherita",
      "lastName": "Saras",
      "state": "CO",
      "zip": 80937
    },
    {
      "address": "8 W Cerritos Ave #54",
      "city": "Bridgeport",
      "firstName": "Art",
      "lastName": "Venere",
      "state": "NJ",
      "zip": "08014"
    },
    {
      "address": "80 Pittsford Victor Rd #9",
      "city": "Cleveland",
      "firstName": "Adelina",
      "lastName": "Nabours",
      "state": "OH",
      "zip": 44103
    },
    {
      "address": "80312 W 32nd St",
      "city": "Conroe",
      "firstName": "Annmarie",
      "lastName": "Castros",
      "state": "TX",
      "zip": 77301
    },
    {
      "address": "81 Norris Ave #525",
      "city": "Ronkonkoma",
      "firstName": "Latrice",
      "lastName": "Tolfree",
      "state": "NY",
      "zip": 11779
    },
    {
      "address": "810 N La Brea Ave",
      "city": "King of Prussia",
      "firstName": "Lashandra",
      "lastName": "Klang",
      "state": "PA",
      "zip": 19406
    },
    {
      "address": "8100 Jacksonville Rd #7",
      "city": "Hays",
      "firstName": "Kimberlie",
      "lastName": "Duenas",
      "state": "KS",
      "zip": 67601
    },
    {
      "address": "8116 Mount Vernon Ave",
      "city": "Bucyrus",
      "firstName": "Roselle",
      "lastName": "Estell",
      "state": "OH",
      "zip": 44820
    },
    {
      "address": "812 S Haven St",
      "city": "Amarillo",
      "firstName": "Cathrine",
      "lastName": "Pontoriero",
      "state": "TX",
      "zip": 79109
    },
    {
      "address": "8139 I Hwy 10 #92",
      "city": "New Bedford",
      "firstName": "Nobuko",
      "lastName": "Halsey",
      "state": "MA",
      "zip": "02745"
    },
    {
      "address": "82 N Highway 67",
      "city": "Oakley",
      "firstName": "Marguerita",
      "lastName": "Hiatt",
      "state": "CA",
      "zip": 94561
    },
    {
      "address": "82 Us Highway 46",
      "city": "Clifton",
      "firstName": "Shonda",
      "lastName": "Greenbush",
      "state": "NJ",
      "zip": "07011"
    },
    {
      "address": "82 Winsor St #54",
      "city": "Atlanta",
      "firstName": "Izetta",
      "lastName": "Funnell",
      "state": "GA",
      "zip": 30340
    },
    {
      "address": "8284 Hart St",
      "city": "Abilene",
      "firstName": "Carlee",
      "lastName": "Boulter",
      "state": "KS",
      "zip": 67410
    },
    {
      "address": "83 County Road 437 #8581",
      "city": "Clarks Summit",
      "firstName": "Rory",
      "lastName": "Papasergi",
      "state": "PA",
      "zip": 18411
    },
    {
      "address": "83649 W Belmont Ave",
      "city": "San Gabriel",
      "firstName": "Cory",
      "lastName": "Gibes",
      "state": "CA",
      "zip": 91776
    },
    {
      "address": "84 Bloomfield Ave",
      "city": "Spartanburg",
      "firstName": "Eun",
      "lastName": "Coody",
      "state": "SC",
      "zip": 29301
    },
    {
      "address": "840 15th Ave",
      "city": "Waco",
      "firstName": "Danica",
      "lastName": "Bruschke",
      "state": "TX",
      "zip": 76708
    },
    {
      "address": "8429 Miller Rd",
      "city": "Pelham",
      "firstName": "Mireya",
      "lastName": "Frerking",
      "state": "NY",
      "zip": 10803
    },
    {
      "address": "85092 Southern Blvd",
      "city": "San Antonio",
      "firstName": "Lorean",
      "lastName": "Martabano",
      "state": "TX",
      "zip": 78204
    },
    {
      "address": "8573 Lincoln Blvd",
      "city": "York",
      "firstName": "Fabiola",
      "lastName": "Hauenstein",
      "state": "PA",
      "zip": 17404
    },
    {
      "address": "8590 Lake Lizzie Dr",
      "city": "Bowling Green",
      "firstName": "Mollie",
      "lastName": "Mcdoniel",
      "state": "OH",
      "zip": 43402
    },
    {
      "address": "8597 W National Ave",
      "city": "Cocoa",
      "firstName": "Lucina",
      "lastName": "Lary",
      "state": "FL",
      "zip": 32922
    },
    {
      "address": "86 Nw 66th St #8673",
      "city": "Shawnee",
      "firstName": "Chanel",
      "lastName": "Caudy",
      "state": "KS",
      "zip": 66218
    },
    {
      "address": "86350 Roszel Rd",
      "city": "Phoenix",
      "firstName": "Keneth",
      "lastName": "Borgman",
      "state": "AZ",
      "zip": 85012
    },
    {
      "address": "866 34th Ave",
      "city": "Denver",
      "firstName": "Howard",
      "lastName": "Paulas",
      "state": "CO",
      "zip": 80231
    },
    {
      "address": "868 State St #38",
      "city": "Cincinnati",
      "firstName": "Margart",
      "lastName": "Meisel",
      "state": "OH",
      "zip": 45251
    },
    {
      "address": "87 Imperial Ct #79",
      "city": "Fargo",
      "firstName": "Lavonda",
      "lastName": "Hengel",
      "state": "ND",
      "zip": 58102
    },
    {
      "address": "87 Sierra Rd",
      "city": "El Monte",
      "firstName": "Tiera",
      "lastName": "Frankel",
      "state": "CA",
      "zip": 91731
    },
    {
      "address": "87163 N Main Ave",
      "city": "New York",
      "firstName": "Derick",
      "lastName": "Dhamer",
      "state": "NY",
      "zip": 10013
    },
    {
      "address": "8728 S Broad St",
      "city": "Coram",
      "firstName": "Krissy",
      "lastName": "Rauser",
      "state": "NY",
      "zip": 11727
    },
    {
      "address": "8739 Hudson St",
      "city": "Vashon",
      "firstName": "Glen",
      "lastName": "Bartolet",
      "state": "WA",
      "zip": 98070
    },
    {
      "address": "87393 E Highland Rd",
      "city": "Indianapolis",
      "firstName": "Carey",
      "lastName": "Dopico",
      "state": "IN",
      "zip": 46220
    },
    {
      "address": "8772 Old County Rd #5410",
      "city": "Kent",
      "firstName": "Samira",
      "lastName": "Heintzman",
      "state": "WA",
      "zip": 98032
    },
    {
      "address": "87895 Concord Rd",
      "city": "La Mesa",
      "firstName": "Brett",
      "lastName": "Mccullan",
      "state": "CA",
      "zip": 91942
    },
    {
      "address": "88 15th Ave Ne",
      "city": "Vestal",
      "firstName": "Kirk",
      "lastName": "Herritt",
      "state": "NY",
      "zip": 13850
    },
    {
      "address": "88 Sw 28th Ter",
      "city": "Harrison",
      "firstName": "Nu",
      "lastName": "Mcnease",
      "state": "NJ",
      "zip": "07029"
    },
    {
      "address": "88827 Frankford Ave",
      "city": "Greensboro",
      "firstName": "Nan",
      "lastName": "Koppinger",
      "state": "NC",
      "zip": 27401
    },
    {
      "address": "89 20th St E #779",
      "city": "Sterling Heights",
      "firstName": "Markus",
      "lastName": "Lukasik",
      "state": "MI",
      "zip": 48310
    },
    {
      "address": "8927 Vandever Ave",
      "city": "Waco",
      "firstName": "Bulah",
      "lastName": "Padilla",
      "state": "TX",
      "zip": 76707
    },
    {
      "address": "8977 Connecticut Ave Nw #3",
      "city": "Niles",
      "firstName": "Judy",
      "lastName": "Aquas",
      "state": "MI",
      "zip": 49120
    },
    {
      "address": "89992 E 15th St",
      "city": "Alliance",
      "firstName": "Flo",
      "lastName": "Bookamer",
      "state": "NE",
      "zip": 69301
    },
    {
      "address": "9 Church St",
      "city": "Salem",
      "firstName": "Andra",
      "lastName": "Scheyer",
      "state": "OR",
      "zip": 97302
    },
    {
      "address": "9 Front St",
      "city": "Washington",
      "firstName": "Alesia",
      "lastName": "Hixenbaugh",
      "state": "DC",
      "zip": 20001
    },
    {
      "address": "9 Hwy",
      "city": "Providence",
      "firstName": "Lawrence",
      "lastName": "Lorens",
      "state": "RI",
      "zip": "02906"
    },
    {
      "address": "9 Murfreesboro Rd",
      "city": "Chicago",
      "firstName": "Carmela",
      "lastName": "Cookey",
      "state": "IL",
      "zip": 60623
    },
    {
      "address": "9 N 14th St",
      "city": "El Cajon",
      "firstName": "Peggie",
      "lastName": "Sturiale",
      "state": "CA",
      "zip": 92020
    },
    {
      "address": "9 N College Ave #3",
      "city": "Milwaukee",
      "firstName": "Daren",
      "lastName": "Weirather",
      "state": "WI",
      "zip": 53216
    },
    {
      "address": "9 Norristown Rd",
      "city": "Troy",
      "firstName": "Herman",
      "lastName": "Demesa",
      "state": "NY",
      "zip": 12180
    },
    {
      "address": "9 Plainsboro Rd #598",
      "city": "Greensboro",
      "firstName": "Maile",
      "lastName": "Linahan",
      "state": "NC",
      "zip": 27409
    },
    {
      "address": "9 State Highway 57 #22",
      "city": "Jersey City",
      "firstName": "Selma",
      "lastName": "Husser",
      "state": "NJ",
      "zip": "07306"
    },
    {
      "address": "9 Tower Ave",
      "city": "Burlington",
      "firstName": "Stephane",
      "lastName": "Myricks",
      "state": "KY",
      "zip": 41005
    },
    {
      "address": "9 Vanowen St",
      "city": "College Station",
      "firstName": "Marvel",
      "lastName": "Raymo",
      "state": "TX",
      "zip": 77840
    },
    {
      "address": "9 W Central Ave",
      "city": "Phoenix",
      "firstName": "Elke",
      "lastName": "Sengbusch",
      "state": "AZ",
      "zip": 85013
    },
    {
      "address": "9 Wales Rd Ne #914",
      "city": "Homosassa",
      "firstName": "Hillary",
      "lastName": "Skulski",
      "state": "FL",
      "zip": 34448
    },
    {
      "address": "9 Waydell St",
      "city": "Fairfield",
      "firstName": "Yvonne",
      "lastName": "Tjepkema",
      "state": "NJ",
      "zip": "07004"
    },
    {
      "address": "90131 J St",
      "city": "Pittstown",
      "firstName": "Van",
      "lastName": "Shire",
      "state": "NJ",
      "zip": "08867"
    },
    {
      "address": "90177 N 55th Ave",
      "city": "Nashville",
      "firstName": "Caprice",
      "lastName": "Suell",
      "state": "TN",
      "zip": 37211
    },
    {
      "address": "90991 Thorburn Ave",
      "city": "New York",
      "firstName": "Willow",
      "lastName": "Kusko",
      "state": "NY",
      "zip": 10011
    },
    {
      "address": "910 Rahway Ave",
      "city": "Philadelphia",
      "firstName": "Dalene",
      "lastName": "Schoeneck",
      "state": "PA",
      "zip": 19102
    },
    {
      "address": "9122 Carpenter Ave",
      "city": "New Haven",
      "firstName": "Yoko",
      "lastName": "Fishburne",
      "state": "CT",
      "zip": "06511"
    },
    {
      "address": "919 Wall Blvd",
      "city": "Meridian",
      "firstName": "Paz",
      "lastName": "Sahagun",
      "state": "MS",
      "zip": 39307
    },
    {
      "address": "92 Broadway",
      "city": "Astoria",
      "firstName": "Janine",
      "lastName": "Rhoden",
      "state": "NY",
      "zip": 11103
    },
    {
      "address": "92 Main St",
      "city": "Atlantic City",
      "firstName": "Cheryl",
      "lastName": "Haroldson",
      "state": "NJ",
      "zip": "08401"
    },
    {
      "address": "92899 Kalakaua Ave",
      "city": "El Paso",
      "firstName": "Kristel",
      "lastName": "Ehmann",
      "state": "TX",
      "zip": 79925
    },
    {
      "address": "93 Redmond Rd #492",
      "city": "Orlando",
      "firstName": "Avery",
      "lastName": "Steier",
      "state": "FL",
      "zip": 32803
    },
    {
      "address": "9387 Charcot Ave",
      "city": "Absecon",
      "firstName": "Thurman",
      "lastName": "Manno",
      "state": "NJ",
      "zip": "08201"
    },
    {
      "address": "9390 S Howell Ave",
      "city": "Albany",
      "firstName": "Scarlet",
      "lastName": "Cartan",
      "state": "GA",
      "zip": 31701
    },
    {
      "address": "94 Chase Rd",
      "city": "Hyattsville",
      "firstName": "Ernest",
      "lastName": "Syrop",
      "state": "MD",
      "zip": 20785
    },
    {
      "address": "94 W Dodge Rd",
      "city": "Carson City",
      "firstName": "Junita",
      "lastName": "Stoltzman",
      "state": "NV",
      "zip": 89701
    },
    {
      "address": "94290 S Buchanan St",
      "city": "Pacifica",
      "firstName": "Wynell",
      "lastName": "Dorshorst",
      "state": "CA",
      "zip": 94044
    },
    {
      "address": "944 Gaither Dr",
      "city": "Strongsville",
      "firstName": "Buddy",
      "lastName": "Cloney",
      "state": "OH",
      "zip": 44136
    },
    {
      "address": "95 Main Ave #2",
      "city": "Barberton",
      "firstName": "Hubert",
      "lastName": "Walthall",
      "state": "OH",
      "zip": 44203
    },
    {
      "address": "9506 Edgemore Ave",
      "city": "Bladensburg",
      "firstName": "Elouise",
      "lastName": "Gwalthney",
      "state": "MD",
      "zip": 20710
    },
    {
      "address": "9581 E Arapahoe Rd",
      "city": "Rochester",
      "firstName": "Dulce",
      "lastName": "Labreche",
      "state": "MI",
      "zip": 48307
    },
    {
      "address": "96263 Greenwood Pl",
      "city": "Warren",
      "firstName": "Ceola",
      "lastName": "Setter",
      "state": "ME",
      "zip": "04864"
    },
    {
      "address": "9635 S Main St",
      "city": "Boise",
      "firstName": "Dorthy",
      "lastName": "Hidvegi",
      "state": "ID",
      "zip": 83704
    },
    {
      "address": "9648 S Main",
      "city": "Salisbury",
      "firstName": "Reena",
      "lastName": "Maisto",
      "state": "MD",
      "zip": 21801
    },
    {
      "address": "96541 W Central Blvd",
      "city": "Phoenix",
      "firstName": "Christiane",
      "lastName": "Eschberger",
      "state": "AZ",
      "zip": 85034
    },
    {
      "address": "9677 Commerce Dr",
      "city": "Richmond",
      "firstName": "Salome",
      "lastName": "Lacovara",
      "state": "VA",
      "zip": 23219
    },
    {
      "address": "96950 Hidden Ln",
      "city": "Aberdeen",
      "firstName": "Detra",
      "lastName": "Coyier",
      "state": "MD",
      "zip": 21001
    },
    {
      "address": "97 Airport Loop Dr",
      "city": "Jacksonville",
      "firstName": "Gracia",
      "lastName": "Melnyk",
      "state": "FL",
      "zip": 32216
    },
    {
      "address": "97 E 3rd St #9",
      "city": "Long Island City",
      "firstName": "Sheron",
      "lastName": "Louissant",
      "state": "NY",
      "zip": 11101
    },
    {
      "address": "9745 W Main St",
      "city": "Randolph",
      "firstName": "Irma",
      "lastName": "Wolfgramm",
      "state": "NJ",
      "zip": "07869"
    },
    {
      "address": "98 Connecticut Ave Nw",
      "city": "Chagrin Falls",
      "firstName": "Graciela",
      "lastName": "Ruta",
      "state": "OH",
      "zip": 44023
    },
    {
      "address": "98 University Dr",
      "city": "San Ramon",
      "firstName": "Georgene",
      "lastName": "Montezuma",
      "state": "CA",
      "zip": 94583
    },
    {
      "address": "985 E 6th Ave",
      "city": "Santa Rosa",
      "firstName": "Charlene",
      "lastName": "Hamilton",
      "state": "CA",
      "zip": 95407
    },
    {
      "address": "987 Main St",
      "city": "Raleigh",
      "firstName": "Lenna",
      "lastName": "Newville",
      "state": "NC",
      "zip": 27601
    },
    {
      "address": "98839 Hawthorne Blvd #6101",
      "city": "Columbia",
      "firstName": "Sabra",
      "lastName": "Uyetake",
      "state": "SC",
      "zip": 29201
    },
    {
      "address": "99 5th Ave #33",
      "city": "Trion",
      "firstName": "Leota",
      "lastName": "Ragel",
      "state": "GA",
      "zip": 30753
    },
    {
      "address": "99 Tank Farm Rd",
      "city": "Hazleton",
      "firstName": "Teri",
      "lastName": "Ennaco",
      "state": "PA",
      "zip": 18201
    },
    {
      "address": "992 Civic Center Dr",
      "city": "Philadelphia",
      "firstName": "Evangelina",
      "lastName": "Radde",
      "state": "PA",
      "zip": 19123
    },
    {
      "address": "993 Washington Ave",
      "city": "Nutley",
      "firstName": "Aja",
      "lastName": "Gehrett",
      "state": "NJ",
      "zip": "07110"
    },
    {
      "address": "99385 Charity St #840",
      "city": "San Jose",
      "firstName": "Elvera",
      "lastName": "Benimadho",
      "state": "CA",
      "zip": 95110
    },
    {
      "address": "9939 N 14th St",
      "city": "Riverton",
      "firstName": "Felicidad",
      "lastName": "Poullion",
      "state": "NJ",
      "zip": "08077"
    },
    {
      "address": "99586 Main St",
      "city": "Dallas",
      "firstName": "Frederica",
      "lastName": "Blunk",
      "state": "TX",
      "zip": 75207
    }
  ].map(person => {
    return {
      firstName: person.firstName,
      lastName: person.lastName,
      address: person.address,
      city: person.city,
      state: person.state,
      zip: person.zip
    };
  });

  constructor(callback: Function) {
    this.populate()
      .then(() => { callback(); })
  }

  private populate() {
    return new Promise(resolve => {
      let count = 500;

      // For each person
      asyncLoop(count, (loop) => {
        let i = loop.getIndex();
        let person = this.persons[i];

        // Create row for person
        let row: IRow = {
          id: `ROW_${i}`,
          cells: (() => {
            // Cells array to return
            let cells: ICell[] = [];
            // All properties in person object
            let keys = Object.keys(person);

            // For each property of person
            asyncLoop(keys.length, (innerLoop) => {
              let j = innerLoop.getIndex();
              let property = keys[j];

              let cell: ICell = {
                // key: property.toUpperCase(),
                value: person[property] // `Row: ${i + 1} - Cell: ${j + 1}`
              };
              cells.push(cell);

              innerLoop.next();
            }, () => {
            })
            return cells;
          })()
        };
        this.rows.push(row);
        loop.next();
      }, () => {
        resolve();
      });
    });
  }

  getData(pageNumber: number, pageSize: number, sortBy: string, sortDirection: string, colIndex: number) {
    let start = (pageNumber - 1) * pageSize;
    let end = pageNumber * pageSize;
    let rows = Object.assign([], this.rows);
    if (sortBy && sortDirection) {
      rows = rows.sort((a, b) => { return compareRows(a, b, colIndex, sortDirection); })
    }
    return { hasError: false, total: rows.length, rows: deepCopy(rows.slice(start, end)) };
  }
}

interface IAsyncLoop {
  /**
  * @description
  * Call loop.next() after your synchronus task completion.
  */
  next: () => void;
  /**
  * @description
  * Call this method to get current loop index.
  */
  getIndex: () => number;
  /**
  * @description
  * Call loop.break() to terminate iterations.
  */
  break: () => void;
}

const asyncLoop = (length: number, onIteration: (loop: IAsyncLoop) => void, onCompletion?: Function) => {
  let index = -1;
  let done = false;
  let loop: IAsyncLoop = {
    next: () => {
      if (done) return;
      if (index < length - 1) {
        index++;
        onIteration(loop);
      } else {
        done = true;
        if (onCompletion) { onCompletion("finish"); }
      }
    },
    getIndex: () => { return index; },
    break: () => {
      done = true;
      if (onCompletion) { onCompletion("break"); }
    }
  };
  loop.next();
}

const compareRows = (a: IRow, b: IRow, index: number, direction: string) => {
  // Use toUpperCase() to ignore character casing
  var bandA = a.cells[index].value;
  var bandB = b.cells[index].value;
  if (typeof bandA == "number") bandA = (<number>bandA).toString();
  if (typeof bandB == "number") bandB = (<number>bandB).toString();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }

  if (direction == ESortDirection.DECENDING) comparison = comparison * -1;
  return comparison;
}
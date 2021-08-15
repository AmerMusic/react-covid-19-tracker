import React, { useEffect, useState } from "react";
import InfoBox from '../src/InfoBox';
import Map from '../src/Map';

import Table from "./Table.js";
import "./Table.css";
import { sortData } from "./util";

import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";

import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getCountriesDAta = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesDAta();
  }, []);

  const onCountryChange = async (event) => {

    const countryCode = event.target.value;

    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);

        setCountryInfo(data);
      })
  };

  console.log("country info", countryInfo);

  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 tracker</h1>
          <FormControl className='app-dropdown'>
            <Select variant="outlined" onChange={onCountryChange} value={country}  >
              <MenuItem value="worldwide">worldwide</MenuItem>

              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>

        <div className="app__stats">

          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />

          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovere} />

          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />

        </div>

        {/* Map */}
        <Map />

      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>

          <h3>Worldwide new cases</h3>
        </CardContent>
        {/* Table */}
        <Table countries={tableData} />
        {/* Graph */}
      
      </Card>

    </div>
  );
}

export default App;

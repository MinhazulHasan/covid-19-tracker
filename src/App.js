import React, { useEffect, useState } from 'react';
import './App.css';
import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select
} from '@material-ui/core';
import { sortData } from './util';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';
import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';
import Footer from './components/Footer/Footer';

function App() {

	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCaseType] = useState('cases');
	const [flag, setFlag] = useState('');

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then(res => res.json())
				.then(data => {
					const countries = data.map(country => (
						{
							name: country.country,
							value: country.countryInfo.iso2
						}
					))
					const sortedData = sortData(data);
					setTableData(sortedData);
					setCountries(countries);
					setMapCountries(data);
				})
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;
		setCountry(countryCode);

		const url = countryCode === 'worldwide'
			? 'https://disease.sh/v3/covid-19/all'
			: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then(res => res.json())
			.then(data => {
				setCountryInfo(data);
				setCountry(countryCode);
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(5);
				setFlag(data.countryInfo.flag);
			})

	}

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then(res => res.json())
			.then(data => {
				setCountryInfo(data);
			})

	}, [])

	return (
		<>
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					{/* BEM => Block Element Modifire */}
					<div>
						<img src={flag} alt="" className='app__flag' />
						<FormControl className='app__dropdown'>
							<Select variant='outlined' value={country} onChange={onCountryChange} >
								<MenuItem value='worldwide'>Worldwide</MenuItem>
								{
									countries.map(country => <MenuItem value={country.value} key={country.name}>
										{country.name}
									</MenuItem>)
								}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="app__status">
					<InfoBox
						title='Coronavirus Cases'
						cases={`+${numeral(countryInfo.todayCases).format("0.0a")}`}
						total={numeral(countryInfo.cases).format("0,0")}
						onClick={e => setCaseType('cases')}
						active={casesType === "cases"}
						isYellow
					/>
					<InfoBox
						title='Recovered'
						cases={`+${numeral(countryInfo.todayRecovered).format("0.0a")}`}
						total={numeral(countryInfo.recovered).format("0,0")}
						onClick={e => setCaseType('recovered')}
						active={casesType === "recovered"}
						isGreen
					/>
					<InfoBox
						title='Death'
						cases={`+${numeral(countryInfo.todayDeaths).format("0.0a")}`}
						total={numeral(countryInfo.deaths).format("0,0")}
						onClick={e => setCaseType('deaths')}
						active={casesType === "deaths"}
						isRed
					/>
				</div>

				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
					casesType={casesType}
				/>
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases By Country</h3>
					<Table countries={tableData}></Table>
					<h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
					<LineGraph className='app__graph' casesType={casesType} />
				</CardContent>
			</Card>
		</div>
		<Footer />
		</>
	);
}

export default App;

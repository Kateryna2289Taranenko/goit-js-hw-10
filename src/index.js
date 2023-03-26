import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
let countryInput = '';
function searchCountry(evt) {
  countryInput = evt.target.value.trim();
  if (countryInput) {
    fetchCountries(countryInput)
      .then(data => {
        makeCountryList(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function makeCountryList(countries) {
  if (countries.length === 1) {
    countryListEl.innerHTML = '';
    return createCountry(countries);
  }
  if (countries.length >= 2 && countries.length <= 10) {
    countryInfoEl.innerHTML = '';
    return createCountriesList(countries);
  }
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function createCountry(data) {
  const markupCountry = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1 class="card-country">
        <img class="flag"src="${flags.svg}" alt="${name.official}" /> 
         ${name.official}
       </h1>
       <ul class="country-list">
         <li class="country-item">
           <h2>Capital:</h2>
           <p class="information">${capital}</p>
         </li>
         <li class="country-item">
           <h2>Population:</h2>
           <p class="information">${population}</p>
         </li>
         <li class="country-item">
           <h2>Languages:</h2>
           <p class="information">${Object.values(languages)}</p>
         </li>
       </ul>`;
    })
    .join('');
  countryInfoEl.innerHTML = markupCountry;
}
function createCountriesList(data) {
  const countriesMarkup = data
    .map(({ flags, name }) => {
      return `<li class="country-item"><img class='image-flag' src='${flags.svg}' alt='${name}'><h3 class="name-country">${name.official}</h3><li>`;
    })
    .join('');
  countryListEl.insertAdjacentHTML('beforeend', countriesMarkup);
}

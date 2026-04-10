import { CountryCityService } from '../../../Service/country';
import { GENDER_OPTIONS, RELIGION_OPTIONS, SOURCE_OPTIONS } from './Candidate-constants';

export abstract class CandidateDropdown {
  protected abstract get _countryCityService(): CountryCityService;

  isGenderDropdownOpen = false;
  isReligionDropdownOpen = false;
  isCountryDropdownOpen = false;
  isCityDropdownOpen = false;
  isSourceDropdownOpen = false;
  genderOptions = GENDER_OPTIONS;
  religionOptions = RELIGION_OPTIONS;
  sourceOptions = SOURCE_OPTIONS;

  selectedGenderLabel = '';
  selectedReligionLabel = '';
  selectedCountryLabel = '';
  selectedCityLabel = '';
  selectedSourceLabel = '';

  abstract gender: string;
  abstract religion: string;
  abstract source: string;
  abstract selectedCountry: string;
  abstract selectedCity: string;
  abstract cities: string[];

  toggleGenderDropdown(event: Event) {
    event.stopPropagation();
    this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
    this.closeOtherDropdowns('gender');
  }

  toggleReligionDropdown(event: Event) {
    event.stopPropagation();
    this.isReligionDropdownOpen = !this.isReligionDropdownOpen;
    this.closeOtherDropdowns('religion');
  }

  toggleCountryDropdown(event: Event) {
    event.stopPropagation();
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
    this.closeOtherDropdowns('country');
  }

  toggleCityDropdown(event: Event) {
    event.stopPropagation();
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
    this.closeOtherDropdowns('city');
  }

  toggleSourceDropdown(event: Event) {
    event.stopPropagation();
    this.isSourceDropdownOpen = !this.isSourceDropdownOpen;
    this.closeOtherDropdowns('source');
  }

  selectGender(option: { value: string; label: string }, event: Event) {
    event.stopPropagation();
    this.gender = option.value;
    this.selectedGenderLabel = option.label;
    this.isGenderDropdownOpen = false;
  }

  selectReligion(option: { value: string; label: string }, event: Event) {
    event.stopPropagation();
    this.religion = option.value;
    this.selectedReligionLabel = option.label;
    this.isReligionDropdownOpen = false;
  }

  selectCountry(country: { code: string; name: string }, event: Event) {
    event.stopPropagation();
    this.selectedCountry = country.code;
    this.selectedCountryLabel = country.name;
    this.selectedCity = '';
    this.selectedCityLabel = '';
    this.cities = this._countryCityService.getCitiesByCountryCode(country.code);
    this.isCountryDropdownOpen = false;
  }

  selectCity(city: string, event: Event) {
    event.stopPropagation();
    this.selectedCity = city;
    this.selectedCityLabel = city;
    this.isCityDropdownOpen = false;
  }

  selectSource(option: { value: string; label: string }, event: Event) {
    event.stopPropagation();
    this.source = option.value;
    this.selectedSourceLabel = option.label;
    this.isSourceDropdownOpen = false;
  }

  closeAllDropdowns(_event?: Event) {
    this.isGenderDropdownOpen = false;
    this.isReligionDropdownOpen = false;
    this.isCountryDropdownOpen = false;
    this.isCityDropdownOpen = false;
    this.isSourceDropdownOpen = false;
  }

  private closeOtherDropdowns(current: string) {
    if (current !== 'gender') this.isGenderDropdownOpen = false;
    if (current !== 'religion') this.isReligionDropdownOpen = false;
    if (current !== 'country') this.isCountryDropdownOpen = false;
    if (current !== 'city') this.isCityDropdownOpen = false;
    if (current !== 'source') this.isSourceDropdownOpen = false;
  }
}

import { useState } from 'react'
import { listResorts, listAllResorts } from '../../Api'
import { usStates, canadaProvinces } from '../../data/statesList'
import inputSanitizer from '../../utils/inputSanitizer'
import './SearchForm.scss'

export const SearchForm = ({ setLoading, setResults }) => {
  const [selectedState, setSelectedState] = useState("");
  const [resortQuery, setResortQuery] = useState("");
  const [inputFocus, setInputFocus] = useState("");
  const [selectFocus, setSelectFocus] = useState("");

  // toggle input focus styles
  const toggleFocus = (inputFocus, selectFocus) => {
    setInputFocus(inputFocus);
    setSelectFocus(selectFocus);
  }

  // list resorts by selected state code
  const handleList = async (stateCode) => {
    setLoading(true);
    setResortQuery("");
    setSelectedState(stateCode);

    const data = await listResorts(stateCode.toLowerCase());
    setResults(data || []);
  };

  // search resorts by name
  const handleSearch = async (resortQuery) => {
    setLoading(true);
    setSelectedState("");
    setResortQuery(resortQuery);

    const data = await listAllResorts();
    const sanitizedQuery = inputSanitizer(resortQuery).toLowerCase();
    // loop through all resorts, only include ones that include search query
    const filteredData = {
      ...data,
      items: data.items.filter(resort =>
        resort.resortName.toLowerCase().includes(sanitizedQuery)
      )
    };
    setResults(filteredData);
  }

  return (
    <div className="search-form">
      {/* resort search */}
      <div className="search-form-group">
        <input type="text" className={inputFocus} placeholder="Search by Resort Name" value={resortQuery} onFocus={() => toggleFocus("", "disabled")} onChange={(e) => handleSearch(e.target.value)} />
      </div>

      <div className="search-form-group">
        <h6>OR</h6>
      </div>

      {/* state list */}
      <div className="search-form-group">
        <select name="state" className={selectFocus} id="state" value={selectedState} onFocus={() => toggleFocus("disabled", "")} onChange={(e) => (e.target.value !== '' ? handleList(e.target.value) : handleSearch(e.target.value))}>
          <option key="" value="">List Resorts by State</option>
          {/* United States */}
          <optgroup label="United States">
            {usStates.map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </optgroup>

          {/* Canada */}
          <optgroup label="Canada">
            {canadaProvinces.map(province => (
              <option key={province.value} value={province.value}>{province.label}</option>
            ))}
          </optgroup>
        </select>
      </div>
    </div>
  )
}
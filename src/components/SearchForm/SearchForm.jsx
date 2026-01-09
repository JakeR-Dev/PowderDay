import { useState } from 'react'
import { listResorts, listAllResorts } from '../../Api'
import { usStates, canadaProvinces } from '../../data/statesList'
import inputSanitizer from '../../utils/inputSanitizer'
import './SearchForm.scss'

export default function SearchForm({ setLoading, setResults }) {
  const [selectedState, setSelectedState] = useState("VT");
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

    const data = await listResorts(stateCode.toLowerCase());
    setResults(data || []);
  };

  // search resorts by name
  const handleSearch = async (resortQuery) => {
    setLoading(true);
    setSelectedState("VT");

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
        <input type="text" className={inputFocus} placeholder="Resort Name" value={resortQuery} onFocus={(e) => toggleFocus("", "disabled")} onChange={(e) => setResortQuery(e.target.value)} />
        <button onClick={() => handleSearch(resortQuery)}>Search by Name</button>
      </div>

      <div className="search-form-group">
        <h6>OR</h6>
      </div>

      {/* state list */}
      <div className="search-form-group">
        <select name="state" className={selectFocus} id="state" value={selectedState} onFocus={(e) => toggleFocus("disabled", "")} onChange={(e) => setSelectedState(e.target.value)}>
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
        <button onClick={() => handleList(selectedState)}>List by State</button>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { listResorts, listAllResorts } from '../../Api'
import { usStates, canadaProvinces } from '../../data/statesList'
import inputSanitizer from '../../utils/inputSanitizer'
import './SearchForm.scss'

export default function SearchForm({ setResults, setHasSearched }) {
  const [selectedState, setSelectedState] = useState("VT");
  const [resortQuery, setResortQuery] = useState("");

  const handleList = async (stateCode) => {
    const data = await listResorts(stateCode.toLowerCase());
    setHasSearched(true);
    setResults(data || []);
  };

  const handleSearch = async (resortQuery) => {
    const data = await listAllResorts();
    const sanitizedQuery = inputSanitizer(resortQuery).toLowerCase();
    setHasSearched(true);

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
      <input type="text" placeholder="Resort Name" value={resortQuery} onChange={(e) => setResortQuery(e.target.value)} />
      <button onClick={() => handleSearch(resortQuery)}>Search by Name</button>

      <h6>OR</h6>

      {/* state list */}
      <select name="state" id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
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
  )
}
import { useState } from 'react'
import { listResorts, listAllResorts } from '../../Api'
import { usStates, canadaProvinces } from '../../data/statesList'
import inputSanitizer from '../../utils/inputSanitizer'
import './SearchForm.scss'

export default function SearchForm({ setLoading, setResults }) {
  const [selectedState, setSelectedState] = useState("VT");
  const [resortQuery, setResortQuery] = useState("");

  const handleList = async (stateCode) => {
    setLoading(true);
    setResortQuery("");

    // list resorts by selected state code
    const data = await listResorts(stateCode.toLowerCase());
    setResults(data || []);
  };

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
        <input type="text" placeholder="Resort Name" value={resortQuery} onChange={(e) => setResortQuery(e.target.value)} />
        <button onClick={() => handleSearch(resortQuery)}>Search by Name</button>
      </div>

      <div className="search-form-group">
        <h6>OR</h6>
      </div>

      {/* state list */}
      <div className="search-form-group">
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
    </div>
  )
}
import { useState } from 'react'
import './SearchForm.scss'

export default function SearchForm({ listResorts, setResults }) {
  const [selectedState, setSelectedState] = useState("VT");

  const handleList = async (stateCode) => {
    const data = await listResorts(stateCode.toLowerCase());
    setResults(data || []);
  };

  return (
    <div className="search-form">
      {/* <input type="text" placeholder="Search resort" value={query} onChange={(e) => setQuery(e.target.value)} /> */}
      <select name="state" id="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
        {/* United States */}
        <optgroup label="United States">
          <option value="AK">Alaska</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="ID">Idaho</option>
          <option value="MA">Massachusetts</option>
          <option value="ME">Maine</option>
          <option value="MT">Montana</option>
          <option value="NH">New Hampshire</option>
          <option value="NY">New York</option>
          <option value="OR">Oregon</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="WA">Washington</option>
          <option value="WY">Wyoming</option>
        </optgroup>

        {/* Canada */}
        <optgroup label="Canada">
          <option value="AB">Alberta</option>
          <option value="BC">British Columbia</option>
          <option value="LB">Labrador</option>
          <option value="MB">Manitoba</option>
          <option value="NF">Newfoundland</option>
          <option value="NS">Nova Scotia</option>
          <option value="ON">Ontario</option>
          <option value="QC">Quebec</option>
          <option value="SK">Saskatchewan</option>
        </optgroup>
      </select>
      <button onClick={() => handleList(selectedState)}>Search</button>
    </div>
  )
}
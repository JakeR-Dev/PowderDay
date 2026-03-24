import { useCallback, useEffect, useRef, useState } from 'react'
import { listResorts, listAllResorts } from '../../Api'
import { usStates, canadaProvinces } from '../../data/statesList'
import inputSanitizer from '../../utils/inputSanitizer'
import './SearchForm.scss'

export const SearchForm = ({ setLoading, setResults }) => {
  const SEARCH_DEBOUNCE_MS = 350;
  const [selectedState, setSelectedState] = useState("");
  const [resortQuery, setResortQuery] = useState("");
  const [inputFocus, setInputFocus] = useState("");
  const [selectFocus, setSelectFocus] = useState("");
  const latestSearchIdRef = useRef(0);

  // toggle input focus styles
  const toggleFocus = (inputFocus, selectFocus) => {
    setInputFocus(inputFocus);
    setSelectFocus(selectFocus);
  }

  // list resorts by selected state code
  const handleList = async (stateCode) => {
    latestSearchIdRef.current += 1;
    setLoading(true);
    setResortQuery("");
    setSelectedState(stateCode);

    const data = await listResorts(stateCode.toLowerCase());
    setResults(data || []);
  };

  // search resorts by name
  const handleSearch = useCallback(async (query, searchId) => {
    setLoading(true);

    const data = await listAllResorts();
    if (searchId !== latestSearchIdRef.current) return;

    const sanitizedQuery = inputSanitizer(query).toLowerCase().trim();
    const items = Array.isArray(data?.items) ? data.items : [];
    // loop through all resorts, only include ones that include search query
    const filteredData = {
      ...data,
      items: items.filter(resort =>
        resort.resortName.toLowerCase().includes(sanitizedQuery)
      )
    };
    setResults(filteredData);
  }, [setLoading, setResults])

  useEffect(() => {
    if (selectedState !== "") return;
    if (resortQuery.trim() === "") return;

    const searchId = latestSearchIdRef.current + 1;
    latestSearchIdRef.current = searchId;

    const timeoutId = setTimeout(() => {
      handleSearch(resortQuery, searchId);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [resortQuery, selectedState, handleSearch]);

  const handleQueryChange = (value) => {
    setSelectedState("");
    setResortQuery(value);
  };

  const handleStateChange = (value) => {
    if (value !== '') {
      handleList(value);
      return;
    }

    setSelectedState("");
    setResortQuery("");
  };

  return (
    <div className="search-form">
      {/* resort search */}
      <div className="search-form-group">
        <input type="text" className={inputFocus} placeholder="Search by Resort Name" value={resortQuery} onFocus={() => toggleFocus("", "disabled")} onChange={(e) => handleQueryChange(e.target.value)} />
      </div>

      <div className="search-form-group">
        <h6>OR</h6>
      </div>

      {/* state list */}
      <div className="search-form-group">
        <select name="state" className={selectFocus} id="state" value={selectedState} onFocus={() => toggleFocus("disabled", "")} onChange={(e) => handleStateChange(e.target.value)}>
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
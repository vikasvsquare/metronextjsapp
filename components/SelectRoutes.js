'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { fetchAllLines } from '@/lib/action';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';

import { Form, InputGroup } from 'react-bootstrap';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';

function SelectRoutes({vetted1, transport1, stat_type1, globalType = true}) {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  const pathName = usePathname();
  const [statType, transportType] = pathName.substring(1).split('/');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vetted, setVetted] = useState(true);

  const vettedType = searchParams.get('vetted');
  const GeoMap = searchParams.get('type');
  const getParamLines = searchParams.get('line');

  useEffect(() => {
    if (pathName) {
      setSelectedValue('');
    }
  }, [pathName]);

  useEffect(() => {
    if (vettedType && vettedType === "false") {
      setVetted(false);
    }
    if (vettedType && vettedType === "true") {
      setVetted(true);
    }
  }, [vettedType])

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // get routes list 
  const handleChange = (value) => {
    if(globalType){
      setSelectedValue(value);
      router.push(pathName + '?' + createQueryString('line', value));
      setIsDropdownOpen(false);
    }else {
      setSelectedValue(value);
      router.push(pathName + '?' + createQueryString('crimeLine', value));
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    async function fetchLinesAsync() {
      const result = await fetchAllLines(stat_type1, transport1, vetted1);
      setOptions(result);
    }
    fetchLinesAsync();
  }, [vetted1, transport1, stat_type1]);

  return (
    <>
      <div className="d-flex flex-column gap-2">
        <p className="metro__dropdown-label mb-1">Select Route</p>
        <Dropdown
          className="metro__dropdown"
          show={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Dropdown.Toggle
            variant="light"
            className="btn dropdown-toggle d-flex gap-2 justify-content-between align-items-center"
            id="metro-dropdown"
          >
            <div className="d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                <path d="M5.45999 0V1.68H3.35999V2.52H5.45999V5.04H3.35999V5.88H5.45999V8.4H3.35999V9.24H5.45999V11.76H3.35999V12.6H5.45999V15.12H3.35999V15.96H5.45999V18.48H3.35999V19.32H5.45999V21H6.29999V0H5.45999ZM14.28 0V1.68H6.71999V2.52H14.28V5.04H6.71999V5.88H14.28V8.4H6.71999V9.24H14.28V11.76H6.71999V12.6H14.28V15.12H6.71999V15.96H14.28V18.48H6.71999V19.32H14.28V21H15.12V0H14.28ZM15.54 1.68V2.52H17.64V1.68H15.54ZM15.54 5.04V5.88H17.64V5.04H15.54ZM15.54 8.4V9.24H17.64V8.4H15.54ZM15.54 11.76V12.6H17.64V11.76H15.54ZM15.54 15.12V15.96H17.64V15.12H15.54ZM15.54 18.48V19.32H17.64V18.48H15.54Z" fill="#2A54A7" />
              </svg>
              <p className="p-0 mb-md-0 mb-0">{selectedValue === '' ? 'All' : selectedValue}</p>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu className="metro__dropdown-menu px-3" style={{ minWidth: 250 }}>
          <Dropdown.Item onClick={() => handleChange('all')}>
                All
          </Dropdown.Item>
            {options.length > 0 && options.map((option, index) => (
              <Dropdown.Item key={index} onClick={() => handleChange(option)}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default SelectRoutes;

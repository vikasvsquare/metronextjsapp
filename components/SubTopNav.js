'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { fetchAllLines } from '@/lib/action';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';

import { Form, InputGroup } from 'react-bootstrap';


function SubTopNav() {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vetted, setVetted] = useState(true);
  const [statType, transportType] = pathName.substring(1).split('/');

  const vettedType = searchParams.get('vetted');
  const GeoMap = searchParams.get('type');
  
  
  useEffect(() => {
    if(pathName){
      setSelectedValue('');
    }
  }, [pathName])
  
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
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    router.push(pathName + '?' + createQueryString('line', value));
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    selectRef.current.focus();
    selectRef.current.click();
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
      if (pathName !== '/') {
        const [statType, transportType] = pathName.substring(1).split('/');
        if (statType === "arrests") {
          const result = await fetchAllLines('arrest', transportType, vetted);
          setOptions(result);
        } else if (statType === "calls-for-service") {
          const result = await fetchAllLines('calls_for_service', transportType, vetted);
          setOptions(result);
        }
        else {
          const result = await fetchAllLines(statType, transportType, vetted);
          setOptions(result);
        }
      } else {
        const result = await fetchAllLines(STAT_TYPE, TRANSPORT_TYPE, vetted);
        setOptions(result);
      }
    }

    fetchLinesAsync();
    console.log(pathName)
  }, [vetted, pathName]);


  return (
    <>
      <div className={`container sub-topnav ${GeoMap === 'geomap' ? 'invisible' : 'visible'}`}>
        <div className="row">
          <div className='col-md-2 d-flex justify-content-between p-0 stats sub-topnavWrapper1 '>
            <Form.Group controlId="customDropdown" ref={dropdownRef}>
              <InputGroup>
                <Form.Control
                  as="select"
                  value={selectedValue}
                  onChange={handleChange}
                  className={isDropdownOpen ? 'show' : ''}
                  ref={selectRef}
                  disabled={transportType === 'system-wide' ? true : false}
                  style={{ backgroundColor: transportType === 'system-wide' && '#ccc' }}
                >
                  <option value="" disabled>Select Routes</option>
                  <option value="all">All Lines</option>
                  {options?.length > 0 && options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                <InputGroup.Text
                  onClick={toggleDropdown}
                  style={{ cursor: 'pointer', position: 'absolute', right: 0, background: 'transparent', border: 0 }}
                >
                  <i className={`bi ${isDropdownOpen ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubTopNav;

'use client';
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchAllLines, fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let thisWeek = [];

import { Accordion, Button } from 'react-bootstrap';
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
  const [vetted, setVetted] = useState(false);
  const dateDropdownRef = useRef(null);

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
    console.log('Selected value:', value);
    router.push(pathName + '?' + createQueryString('line', value));
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = (e) => {
    // e.preventDefault();
    selectRef.current.focus();
    selectRef.current.click();
    // setIsDropdownOpen((prev) => !prev);
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
      const result = await fetchAllLines(STAT_TYPE, TRANSPORT_TYPE, vetted);
      console.log(STAT_TYPE, TRANSPORT_TYPE, vetted == false);
      setOptions(result);
    }

    fetchLinesAsync();
  }, [vetted]);



  return (
    <>
      <div className="container sub-topnav">
        <div className="row">
          <div className='sub-topnavWrapper1 col-md-2 d-flex justify-content-between p-0 stats'>
            <Form.Group controlId="customDropdown" ref={dropdownRef}>
              <InputGroup>
                <Form.Control
                  as="select"
                  value={selectedValue}
                  onChange={handleChange}
                  className={isDropdownOpen ? 'show' : ''}
                  // onBlur={() => setIsDropdownOpen(false)}
                  // onFocus={() => setIsDropdownOpen(true)}
                  ref={selectRef}
                >
                  <option value="" disabled>Select Routes</option>
                  <option value="all">All Lines</option>
                  {options.map((option, index) => (
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
          {/* <div className='col-md-10'>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default SubTopNav;

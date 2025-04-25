'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { fetchAllLines } from '@/lib/action';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';

import { Form, InputGroup } from 'react-bootstrap';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';

function SelectDateDropdown() {
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
  const getParamLines = searchParams.get('line');


  useEffect(() => {
    if (pathName) {
      setSelectedValue('');
    }
  }, [pathName])
  // useEffect(() => {
  //   if(getParamLines){
  //     if(getParamLines === 'all'){
  //       setOptions([]);
  //       setSelectedValue('');
  //     }
  //   }
  // }, [getParamLines])

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
    // const value = event.target.value;
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
  }, [vetted, pathName]);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };
  return (
    <>
      <div className="d-flex flex-column gap-2">
            <p className="metro__dropdown-label">Date</p>
            <Dropdown className="metro__dropdown">
              <Dropdown.Toggle
                variant="light"
                className="btn dropdown-toggle d-flex gap-2 justify-content-between align-items-center"
                id="date-range-dropdown"
                style={{
                  width: '237px',
                  height: '32px',
                  borderRadius: '4px',
                  boxShadow: '0px 4px 4px 0px #0000001A'
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                    <path d="M15.6 9.69727C15.975 9.96419 16.3094 10.2669 16.6031 10.6055C16.8969 10.944 17.15 11.3151 17.3625 11.7188C17.575 12.1224 17.7313 12.5488 17.8313 12.998C17.9313 13.4473 17.9875 13.9062 18 14.375C18 15.1497 17.8594 15.8789 17.5781 16.5625C17.2969 17.2461 16.9094 17.8418 16.4156 18.3496C15.9219 18.8574 15.35 19.2578 14.7 19.5508C14.05 19.8438 13.35 19.9935 12.6 20C12.0312 20 11.4813 19.9121 10.95 19.7363C10.4188 19.5605 9.93125 19.3066 9.4875 18.9746C9.04375 18.6426 8.65 18.2454 8.30625 17.7832C7.9625 17.321 7.69688 16.8099 7.50938 16.25H0V1.25H2.4V0H3.6V1.25H12V0H13.2V1.25H15.6V9.69727ZM1.2 2.5V5H14.4V2.5H13.2V3.75H12V2.5H3.6V3.75H2.4V2.5H1.2ZM7.22813 15C7.20938 14.7982 7.2 14.5898 7.2 14.375C7.2 13.8151 7.275 13.2715 7.425 12.7441C7.575 12.2168 7.80313 11.7188 8.10938 11.25H7.2V10H8.4V10.8398C8.65625 10.5078 8.94063 10.2148 9.25313 9.96094C9.56563 9.70703 9.90313 9.48893 10.2656 9.30664C10.6281 9.12435 11.0063 8.98763 11.4 8.89648C11.7938 8.80534 12.1938 8.75651 12.6 8.75C13.225 8.75 13.825 8.85742 14.4 9.07227V6.25H1.2V15H7.22813ZM12.6 18.75C13.1813 18.75 13.725 18.6361 14.2313 18.4082C14.7375 18.1803 15.1813 17.8678 15.5625 17.4707C15.9438 17.0736 16.2438 16.6113 16.4625 16.084C16.6813 15.5566 16.7938 14.987 16.8 14.375C16.8 13.7695 16.6906 13.2031 16.4719 12.6758C16.2531 12.1484 15.9531 11.6862 15.5719 11.2891C15.1906 10.8919 14.7469 10.5794 14.2406 10.3516C13.7344 10.1237 13.1875 10.0065 12.6 10C12.0188 10 11.475 10.1139 10.9688 10.3418C10.4625 10.5697 10.0188 10.8822 9.6375 11.2793C9.25625 11.6764 8.95625 12.1387 8.7375 12.666C8.51875 13.1934 8.40625 13.763 8.4 14.375C8.4 14.9805 8.50938 15.5469 8.72813 16.0742C8.94688 16.6016 9.24688 17.0638 9.62813 17.4609C10.0094 17.8581 10.4531 18.1706 10.9594 18.3984C11.4656 18.6263 12.0125 18.7435 12.6 18.75ZM13.2 13.75H15V15H12V11.25H13.2V13.75ZM2.4 10H3.6V11.25H2.4V10ZM4.8 10H6V11.25H4.8V10ZM4.8 7.5H6V8.75H4.8V7.5ZM2.4 12.5H3.6V13.75H2.4V12.5ZM4.8 12.5H6V13.75H4.8V12.5ZM8.4 8.75H7.2V7.5H8.4V8.75ZM10.8 8.75H9.6V7.5H10.8V8.75ZM13.2 8.75H12V7.5H13.2V8.75Z" fill="#2A54A7" />
                  </svg>
                  <p className="p-0 mb-md-0">Jan 2024 - Dec 2024</p>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Action</Dropdown.Item>
                <Dropdown.Item href="#">Something else here</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
    </>
  );
}

export default SelectDateDropdown;

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Modal, Button, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import SelectDate from '../SelectDate';


// Reusable component for each group
const TransportToggle = ({ header, label, enabled, setEnabled, frequency, setFrequency, setDates, published }) => (
    <>
        <hr style={{ height: '1px', padding: 0, margin: '0' }} />
        <Form.Group controlId={`${label}Toggle`} className="align-items-center d-flex justify-between">
            <Form.Check type="switch" label={label} checked={enabled} onChange={() => setEnabled(!enabled)} style={{ width: '180px' }} />
            {enabled && (
                <>
                    <ToggleButtonGroup
                        type="radio"
                        name={`${header}-${label}Frequency`}
                        value={frequency}
                        onChange={(val) => setFrequency(val)}
                        className="ml-3"
                    >
                        <ToggleButton id={`${label}-monthly`} value="Monthly">Monthly</ToggleButton>
                        <ToggleButton id={`${label}-weekly`} value="Weekly">Weekly</ToggleButton>
                    </ToggleButtonGroup>
                    <SelectDate vetted={frequency === 'Monthly' ? true : false} header={header} label={label} frequency={frequency} setDates={setDates} published={published} />
                </>
            )}
        </Form.Group>
    </>

);

function CustomModal({ show, handleClose, children }) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const publishType = searchParams.get('published');
    const [published, setPublished] = useState(true);
    const [crime, setCrime] = useState({
        railEnabled: false,
        busEnabled: false,
        systemwideEnabled: false,
        railFrequency: 'Monthly',
        busFrequency: 'Monthly',
        systemwideFrequency: 'Monthly',
        railDate: [], // Adding date fields
        busDate: [],
        systemwideDate: [],
    });
    const [arrest, setArrest] = useState({
        railEnabled: false,
        busEnabled: false,
        systemwideEnabled: false,
        railFrequency: 'Monthly',
        busFrequency: 'Monthly',
        systemwideFrequency: 'Monthly',
        railDate: [], // Adding date fields
        busDate: [],
        systemwideDate: [],
    });

    const [calls, setCalls] = useState({
        railEnabled: false,
        busEnabled: false,
        systemwideEnabled: false,
        railFrequency: 'Monthly',
        busFrequency: 'Monthly',
        systemwideFrequency: 'Monthly',
        railDate: [], // Adding date fields
        busDate: [],
        systemwideDate: [],
    });

    //check publish flag in url
    useEffect(() => {
        if (typeof (publishType) === 'object') {
            setPublished(true)
        }
        if (publishType && publishType === 'true') {
            setPublished(true)
        }
        if (publishType && publishType === 'false') {
            setPublished(false)
        }
    }, [publishType])

    // Use useCallback to memoize the function
    const handleSetCrime = useCallback((newValues) => {
        setCrime((prev) => ({ ...prev, ...newValues }));
    }, []);
    const handleSetArrest = useCallback((newValues) => {
        setArrest((prev) => ({ ...prev, ...newValues }));
    }, []);
    const handleSetCalls = useCallback((newValues) => {
        setCalls((prev) => ({ ...prev, ...newValues }));
    }, []);

    const submitHandler = async () => {
        const apiCalls = [];
        if (crime.railEnabled && crime.railDate.length > 0) {
            // console.log(crime);
            apiCalls.push(publshUnPublishHandler('crime', crime.railFrequency, 'rail', crime.railDate, published));
        }
        if (crime.busEnabled) {
            apiCalls.push(publshUnPublishHandler('crime', crime.busFrequency, 'bus', crime.busDate, published));
        }
        if (crime.systemwideEnabled) {
            apiCalls.push(publshUnPublishHandler('crime', crime.busFrequency, 'systemwide', crime.systemwideDate, published));
        }
        if (arrest.railEnabled && arrest.railDate.length > 0) {
            apiCalls.push(publshUnPublishHandler('arrest', arrest.railFrequency, 'rail', arrest.railDate, published));
        }
        if (arrest.busEnabled) {
            apiCalls.push(publshUnPublishHandler('arrest', arrest.busFrequency, 'bus', arrest.busDate, published));
        }
        if (arrest.systemwideEnabled) {
            apiCalls.push(publshUnPublishHandler('arrest', arrest.busFrequency, 'systemwide', arrest.systemwideDate, published));
        }
        if (calls.railEnabled && calls.railDate.length > 0) {
            apiCalls.push(publshUnPublishHandler('call_for_service', calls.railFrequency, 'rail', calls.railDate, published));
        }
        if (calls.busEnabled) {
            apiCalls.push(publshUnPublishHandler('call_for_service', calls.busFrequency, 'bus', calls.busDate, published));
        }
        if (calls.systemwideEnabled) {
            apiCalls.push(publshUnPublishHandler('call_for_service', calls.busFrequency, 'systemwide', calls.systemwideDate, published));
        }

        const results = await Promise.all(apiCalls);
        if (published) {
            const query = new URLSearchParams({
                "published": !published
            }).toString();

            router.push(`${pathName}/?${query}`);
            handleClose()
        } else {
            const query = new URLSearchParams({
                "published": !published
            }).toString();

            router.push(`${pathName}/?${query}`);
            handleClose()
        }
    }

    const publshUnPublishHandler = useCallback(async (STAT_TYPE, frequencyVal, TransType, selectedDates, publishedVal) => {
        try {
            let bodyObj = {};
            if (frequencyVal === 'Monthly') {
                bodyObj = {
                    transport_type: TransType,
                    vetted: true,
                    dates: selectedDates,
                    published: !publishedVal,
                    status: "monthly"
                };
            } else {
                const result = {};

                // Helper function to format the date keys
                const formatDateKey = (dateString) => {
                    const [year, month, day] = dateString.split('-');
                    return `${year}-${month}-${day}`;
                };

                // Group and aggregate values
                const dateMap = selectedDates.reduce((acc, item) => {
                    const parts = item.split('-');
                    const date = parts.slice(0, 3).join('-');
                    const value = parts[3];

                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(value);
                    return acc;
                }, {});

                // Format the results
                const formattedDates = [];
                for (const [date, values] of Object.entries(dateMap)) {
                    // Sort and join the values into a string
                    const valueString = values.sort((a, b) => a - b);
                    formattedDates.push({ [formatDateKey(date)]: valueString });
                }

                // Add additional properties
                result.dates = formattedDates;
                result.published = !publishedVal;
                result.transport_type = TransType;
                result.vetted = false;
                result.status = 'weekly';
                bodyObj = result;
            }

            //   console.log(bodyObj);
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/update_date_details`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            });

            if (!response.ok) {
                throw new Error('Failed to update data!');
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>{published ? 'Un-Publish Data' : 'Publish Data'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* {children} */}
                    <h3>Crime</h3>
                    <TransportToggle
                        header={'crime'}
                        label="Rail"
                        enabled={crime.railEnabled}
                        // setEnabled={(val) => setCrime({ ...crime, railEnabled: val })}
                        setEnabled={(val) => handleSetCrime({ railEnabled: val })}
                        frequency={crime.railFrequency}
                        // setFrequency={(val) => setCrime({ ...crime, railFrequency: val })}
                        setFrequency={(val) => handleSetCrime({ railFrequency: val })}
                        setDates={(selectedDate) => handleSetCrime({ railDate: selectedDate })}
                        published={published}
                    />
                    <TransportToggle
                        header={'crime'}
                        label="Bus"
                        enabled={crime.busEnabled}
                        // setEnabled={(val) => setCrime({ ...crime, busEnabled: val })}
                        setEnabled={(val) => handleSetCrime({ busEnabled: val })}
                        frequency={crime.busFrequency}
                        // setFrequency={(val) => setCrime({ ...crime, busFrequency: val })}
                        setFrequency={(val) => handleSetCrime({ busFrequency: val })}
                        setDates={(selectedDate) => handleSetCrime({ busDate: selectedDate })}
                        published={published}
                    />
                    <TransportToggle
                        header={'crime'}
                        label="Systemwide"
                        enabled={crime.systemwideEnabled}
                        // setEnabled={(val) => setCrime({ ...crime, systemwideEnabled: val })}
                        setEnabled={(val) => handleSetCrime({ systemwideEnabled: val })}
                        frequency={crime.systemwideFrequency}
                        // setFrequency={(val) => setCrime({ ...crime, systemwideFrequency: val })}
                        setFrequency={(val) => handleSetCrime({ systemwideFrequency: val })}
                        setDates={(selectedDate) => handleSetCrime({ systemwideDate: selectedDate })}
                        published={published}
                    />
                    <hr />
                    <h3>Arrests</h3>
                    <TransportToggle
                        header={'Arrests'}
                        label="Rail"
                        enabled={arrest.railEnabled}
                        // setEnabled={(val) => setArrest({ ...arrest, railEnabled: val })}
                        setEnabled={(val) => handleSetArrest({ railEnabled: val })}
                        frequency={arrest.railFrequency}
                        // setFrequency={(val) => setArrest({ ...arrest, railFrequency: val })}
                        setFrequency={(val) => handleSetArrest({ railFrequency: val })}
                        setDates={(selectedDate) => handleSetArrest({ railDate: selectedDate })}
                        published={published}
                    />
                    <TransportToggle
                        header={'Arrests'}
                        label="Bus"
                        enabled={arrest.busEnabled}
                        // setEnabled={(val) => setArrest({ ...arrest, busEnabled: val })}
                        setEnabled={(val) => handleSetArrest({ busEnabled: val })}
                        frequency={arrest.busFrequency}
                        // setFrequency={(val) => setArrest({ ...arrest, busFrequency: val })}
                        setFrequency={(val) => handleSetArrest({ busFrequency: val })}
                        setDates={(selectedDate) => handleSetArrest({ busDate: selectedDate })}
                        published={published}
                    />
                    <TransportToggle
                        header={'Arrests'}
                        label="Systemwide"
                        enabled={arrest.systemwideEnabled}
                        // setEnabled={(val) => setArrest({ ...arrest, systemwideEnabled: val })}
                        setEnabled={(val) => handleSetArrest({ systemwideEnabled: val })}
                        frequency={arrest.systemwideFrequency}
                        // setFrequency={(val) => setArrest({ ...arrest, systemwideFrequency: val })}
                        setFrequency={(val) => handleSetArrest({ systemwideFrequency: val })}
                        setDates={(selectedDate) => handleSetArrest({ systemwideDate: selectedDate })}
                        published={published}
                    />
                    <hr />
                    <h3>Calls for Services</h3>
                    <TransportToggle
                        header={'calls'}
                        label="Rail"
                        enabled={calls.railEnabled}
                        // setEnabled={(val) => setCalls({ ...calls, railEnabled: val })}
                        setEnabled={(val) => handleSetCalls({ railEnabled: val })}
                        frequency={calls.railFrequency}
                        // setFrequency={(val) => setCalls({ ...calls, railFrequency: val })}
                        setFrequency={(val) => handleSetCalls({ railFrequency: val })}
                        setDates={(val) => handleSetCalls({ railDate: val })}
                        published={published}
                    />
                    <TransportToggle
                        header={'calls'}
                        label="Bus"
                        enabled={calls.busEnabled}
                        // setEnabled={(val) => setCalls({ ...calls, busEnabled: val })}
                        setEnabled={(val) => handleSetCalls({ busEnabled: val })}
                        frequency={calls.busFrequency}
                        // setFrequency={(val) => setCalls({ ...calls, busFrequency: val })}
                        setFrequency={(val) => handleSetCalls({ busFrequency: val })}
                        setDates={(val) => handleSetCalls({ busDate: val })}
                        published={published}
                    />
                    <TransportToggle
                        header={'calls'}
                        label="Systemwide"
                        enabled={calls.systemwideEnabled}
                        // setEnabled={(val) => setCalls({ ...calls, systemwideEnabled: val })}
                        setEnabled={(val) => handleSetCalls({ systemwideEnabled: val })}
                        frequency={calls.systemwideFrequency}
                        // setFrequency={(val) => setCalls({ ...calls, systemwideFrequency: val })}
                        setFrequency={(val) => handleSetCalls({ systemwideFrequency: val })}
                        setDates={(val) => handleSetCalls({ systemwideDate: val })}
                        published={published}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={submitHandler}>
                        {published ? 'Un-Publish Data' : 'Publish Data'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CustomModal;

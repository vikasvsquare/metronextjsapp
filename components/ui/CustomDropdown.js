import React, { useState, useEffect } from 'react';
import Dropdown from 'rsuite/Dropdown';
import 'rsuite/dist/rsuite.min.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ImageRail() {
  return (
    <>
      <Image className="object-contain h-full" alt="Crime Systemwide" src="/assets/metro-rail.png" width={75} height={75} priority />
    </>
  );
}
function ImageBus() {
  return (
    <>
      <Image className="object-contain h-full" alt="Crime Systemwide" src="/assets/metro-bus.png" width={75} height={75} priority />
    </>
  );
}
function ImageSystemWide() {
  return (
    <>
      <Image
        className="object-contain h-full"
        alt="Crime Systemwide"
        src="/assets/metro-system-wide.png"
        width={75}
        height={75}
        priority
      />
    </>
  );
}

function CustomDropdown() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('crime');
  const [icon, setIcon] = useState('rail');

  // const createQueryString = useCallback(
  //   (name, value) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  useEffect(() => {
    if(pathName){
      setTitle(pathName.substring(1).split('/')[0])
    }

    if(pathName && pathName.substring(1).split('/')[1] === 'rail'){
      setIcon('rail');
    } else if(pathName && pathName.substring(1).split('/')[1] === 'bus'){
      setIcon('bus');
    }else if(pathName && pathName.substring(1).split('/')[1] === 'system-wide'){
      setIcon('system-wide');
    }
  }, [pathName])
  
  function handleVettedToggle(value) {
    setVetted(value);
    router.push(pathName);
  }


  const onSelectHandle = (e) => {
    setTitle(e);
    if(e === 'crime'){
      router.push('/crime/'+ pathName.substring(1).split('/')[1])
    }
    if(e === 'calls-for-service'){
      router.push('/calls-for-service/'+ pathName.substring(1).split('/')[1])
    }
    if(e === 'arrests'){
      router.push('/arrests/'+ pathName.substring(1).split('/')[1])
    }
  };

  const replaceHyphen = (title) => {
    return title.replace(/-/g, " ");
  }
  return (
    <div className="hidden-mobile">
    <Dropdown title={replaceHyphen(title)} icon={icon === 'rail' ? <ImageRail /> : icon === 'bus' ? <ImageBus /> : icon === 'system-wide' ? <ImageSystemWide /> : ImageRail} activeKey={title}  onSelect={onSelectHandle}>
      <Dropdown.Item active={title === 'crime' ? true : false} eventKey="crime">
        Crime
      </Dropdown.Item>
      <Dropdown.Item active={title === 'calls-for-service' ? true : false} eventKey="calls-for-service">
        Calls for Service
      </Dropdown.Item>
      <Dropdown.Item active={title === 'arrests' ? true : false} eventKey="arrests">
        Arrests
      </Dropdown.Item>
    </Dropdown>
    </div>
  );
}

export default CustomDropdown;

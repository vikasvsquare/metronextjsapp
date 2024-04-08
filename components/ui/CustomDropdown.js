import React from 'react';
import Dropdown from 'rsuite/Dropdown';
import 'rsuite/dist/rsuite.min.css';
import PageIcon from '@rsuite/icons/Page';
import FolderFillIcon from '@rsuite/icons/FolderFill';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import Image from 'next/image';

function Image1() {
  return (
    <>
      <Image className="object-contain h-full" alt="Crime System Wide" src="/assets/metro-group.svg" width={75} height={75} priority />
    </>
  );
}

function CustomDropdown() {
  return (
    <Dropdown title="Crime" icon={<Image1 />}>
      <Dropdown.Item icon={<PageIcon />} active>
        Crime
      </Dropdown.Item>
      <Dropdown.Item icon={<PageIcon />} active>
        Call For Service
      </Dropdown.Item>
      <Dropdown.Item icon={<PageIcon />} active>
        Arrest
      </Dropdown.Item>
    </Dropdown>
  );
}

export default CustomDropdown;

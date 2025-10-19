'use client';

import { Content, List, Root, Trigger, TabsProps } from '@radix-ui/react-tabs';
import { ReactNode, useState } from 'react';
import { Button } from './button';

interface TabItem {
  label: string;
  content: ReactNode;
}

interface ITabsProp extends TabsProps {
  tabs: TabItem[];
  tabsStyle?: string;
}

const Tabs = ({ tabs, tabsStyle, ...props }: ITabsProp) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <Root
      {...props}
      value={activeTab}
      onValueChange={(val) => setActiveTab(val)}
    >
      <List className={`my-4 flex gap-4 ${tabsStyle}`}>
        {tabs.map((tab, index) => (
          <Trigger value={tab.label} key={index} asChild>
            <Button variant={activeTab === tab.label ? 'default' : 'outline'}>
              {tab.label}
            </Button>
          </Trigger>
        ))}
      </List>

      {tabs.map((tab, index) => (
        <Content key={index} value={tab.label} className="py-4">
          {tab.content}
        </Content>
      ))}
    </Root>
  );
};

export default Tabs;

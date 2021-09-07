import React, { useState } from 'react';
import { addons, types } from '@storybook/addons';
import { useChannel } from '@storybook/api';
import { AddonPanel, ScrollArea } from '@storybook/components';
import { ADDONS_MOCK_UPDATE_DATA } from './utils/events';
import { RequestItem } from './components/RequestItem';

const ADDON_ID = 'mockAddon';
const PARAM_KEY = 'mockAddon';
const PANEL_ID = `${ADDON_ID}/panel`;

const MockPanel = () => {
    const [mockData, setMockData] = useState([]);
    const emit = useChannel({
        ADDONS_MOCK_SEND_DATA: (parameters) => {
            setMockData(parameters);
        },
    });

    const onSkip = (item: any) => {
        emit(ADDONS_MOCK_UPDATE_DATA, item, 'skip', !item.skip);
    };

    const onStatusChange = (item: any ,value: any) => {
        emit(ADDONS_MOCK_UPDATE_DATA, item, 'status', value);
    };

    const onResponseChange = (item: any, value: any) => {
        emit(ADDONS_MOCK_UPDATE_DATA, item, 'response', value);
    };

    return (
        <ScrollArea>
            {mockData.map((item: any, index :number) => (
                <RequestItem
                    key={index}
                    url={item.url}
                    skip={item.skip}
                    method={item.method}
                    status={item.status}
                    response={item.response}
                    onToggle={() => onSkip(item)}
                    onStatusChange={(event) =>
                        onStatusChange(item, event.target.value)
                    }
                    onResponseChange={(value) =>
                        onResponseChange(item, value.jsObject)
                    }
                />
            ))}
        </ScrollArea>
    );
};

interface Props {
    active: boolean;
    key: string;
}
function register() {
    addons.register(ADDON_ID, () => {
        // eslint-disable-next-line react/prop-types
        const render = (props : Props) => (
            <AddonPanel active={props.active} key={props.key}>
                <MockPanel />
            </AddonPanel>
        );
        const title = 'Mock Request';

        addons.add(PANEL_ID, {
            type: types.PANEL,
            title,
            render,
            paramKey: PARAM_KEY,
        });
    });
}

export default register();

import {useState} from "react";
import HardDriveDataDisplay from "./hardDriveDataDisplay";
import SmartAttributesTable from "./smartAttributesTable";
import TaskDisplay from "./taskDisplay";
import SearchInput from "./searchInput";
import {Tab, Tabs} from "react-bootstrap";




function HardDriveDisplay ({resultsVisible,hardDriveData}) {
    return (<>
        {resultsVisible &&
            <HardDriveDataDisplay hardDrive={hardDriveData}>
                <SmartAttributesTable hardDrive={hardDriveData} />
                <br/>
                {resultsVisible && hardDriveData.tasks.length > 0 && <h1 className={"pb-3 h1"}>TASKS</h1>}
                {resultsVisible && hardDriveData.tasks.length > 0 && <TaskDisplay tasks={hardDriveData.tasks}/>}
            </HardDriveDataDisplay>}
        <br/>
        <br/>
        <br/>
    </>
    )
}

function convertDateFormat(inputString) {
    const date = new Date(inputString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    let ampm = 'AM';

    if (hours >= 12) {
        ampm = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    }

    hours = String(hours).padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}
export default function HardDriveSearch() {
    // internal state
    const [resultsVisible,setResultsVisible] = useState(false);
    const [hardDriveData,setHardDriveData] = useState({});
    return (
            <div style={{
                padding:"0 14%"
            }}>
                <SearchInput
                    setResultsVisible={setResultsVisible}
                    setHardDriveData={setHardDriveData}
                />
                <br/>
                {resultsVisible && hardDriveData.length === 1 && <hr/>}
                {resultsVisible && hardDriveData.length === 1 && <HardDriveDisplay resultsVisible={resultsVisible} hardDriveData={hardDriveData[0]}/>}

                {resultsVisible && hardDriveData.length > 1 &&
                    <Tabs
                        defaultActiveKey="0"
                        className="mb-3 mx-4"
                    >
                        {
                            hardDriveData.map((data,index)=>{
                                return <Tab title={convertDateFormat(data.report.created)} key={index} eventKey={index}>
                                    <HardDriveDisplay
                                        resultsVisible={resultsVisible}
                                        hardDriveData={data}/>
                                </Tab>
                            })
                        }


                    </Tabs>
                }
            </div>
    )

}
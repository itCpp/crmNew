import './gates.css';

import GatesMenu from './GatesMenu';
import GateContent from './GateContent';

function GatesMain() {

    return <div className="d-flex ">

        <div className="gates-menu">
            <GatesMenu />
        </div>

        <div className="gates-content flex-grow-1">
            <GateContent />
        </div>

    </div>

}

export default GatesMain;
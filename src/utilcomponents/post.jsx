import { TbHandClick } from "react-icons/tb";

export function Post () {
    return (
        <div className="post">
            <div className="post-head">
                <h2 className="name">Long D.</h2>
                <p className="date">Jan. 1, 2026</p>
            </div>
            <p className="feeling">
                <span>Happy</span>
                <span>Emotional</span>
            </p>
            
            <div className="expandable-view">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua...
            </div>

            <div className="click-icon-container"><TbHandClick/></div>

            <div className="background"></div>
        </div>
    )
}
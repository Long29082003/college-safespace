export const Background = () => {

    return (
        <mesh position = {[0, 0, -100]}>
            <planeGeometry args = {[300, 300]}/>
            <meshBasicMaterial color = {"white"}/>
        </mesh>
    )
};
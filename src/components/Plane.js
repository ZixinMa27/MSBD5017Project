//set map size, and color
const Plane = () => {
    return (
        <mesh position={[0, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[60, 60]} />
            <meshStandardMaterial color={"#E1FFFF"} />  
        </mesh>
    );
}

export default Plane;
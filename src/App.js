import Web3 from 'web3';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import './App.css';
import { OrbitControls } from '@react-three/drei'

// Import Components
import Navbar from './components/Navbar';
import Plane from './components/Plane';
import Plot from './components/Plot';
import Building from './components/Building';
import FormDialog2 from './components/FormDialog2';

// Dialog components(its hard to cancel the component if write a separate file)
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Import Contract ABI
import Land from './abis/Land.json';



function App() {
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)

	// Contract & Contract States
	const [landContract, setLandContract] = useState(null)
	const [cost, setCost] = useState(null)
	const [buildings, setBuildings] = useState(null)
	const [landId, setLandId] = useState(null)
	const [landName, setLandName] = useState(null)
	const [landOwner, setLandOwner] = useState(null)
	const [hasOwner, setHasOwner] = useState(false)



	const loadBlockchainData = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()
			if (accounts.length > 0) {
				setAccount(accounts[0])
			}

			//local run
			//const networkId = await web3.eth.net.getId()
			// const land = new web3.eth.Contract(Land.abi,Land.networks[networkId].address)

			// fill in contract address
			const land = new web3.eth.Contract(Land.abi,"0x747B998A0E472Ae23ECc34dc124B1e0F0A736814")

			setLandContract(land)
			const cost = await land.methods.cost().call()
			setCost(web3.utils.fromWei(cost.toString(), 'ether'))
			const buildings = await land.methods.getBuildings().call()
			setBuildings(buildings)

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})
			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		} else{
			alert("do not install metamask")
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	// Reload the data if account or cost changes
	useEffect(() => {
		loadBlockchainData()
	}, [account, cost])


	// Control the alert dialog(if the user has not connected to MetaMask)
	const [AlertOpen, setAlertOpen] = React.useState(false);
	const handleClickOpen = () => {
	  setAlertOpen(true);
	};
	const handleClose = () => {
	  setAlertOpen(false);
	};

	// buy property
	const buyHandler = async (_id) => {
		if (account === null) {
			handleClickOpen()
			return
		}
		try {
			// mint and revise name
			let actualCost = web3.utils.toWei(cost, 'ether')
			await landContract.methods.mint(_id).send({ from: account, value: actualCost })
			const newName = document.getElementById('name-input').value;
			if (newName) {
				await reviseName(_id, newName);
			}
			// update building status
			const buildings = await landContract.methods.getBuildings().call()
			setBuildings(buildings)
			setLandName(buildings[_id - 1].name)
			setLandOwner(buildings[_id - 1].owner)
			setHasOwner(true)
			window.alert('Success buying')

		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}

	// revise new name
	const reviseName = async (_id, newName) =>{
		try {
			await landContract.methods.reviseName(_id, newName).send({ from: account})
		} catch (error) {
			window.alert('Error occurred when revise a name')
		}
	}

	// revise new cost
	const reviseCost = async (newCost) => {
		try {
			await landContract.methods.reviseCost(newCost).send({from: account})
			setCost(newCost)
		} catch (error) {
			window.alert('Error occurred when revising cost')
		}
	}


	// request transfer of ownership
	const requestTransfer = async (_id, _buyer) => {
		try {
			await landContract.methods.requestTransfer(_id, _buyer).send({from: account})
			window.alert('Success, owner will review your request')
		}
		catch (error) {
			window.alert('Error occurred when request transfer')
		}
	}

	const approveTransfer = async (_id, _newOwner) => {
		try {
			await landContract.methods.approve(_newOwner, _id).send({ from: account })
			window.alert('Success, transfer approved')
		}
		catch (error) {
			window.alert('Error occurred when approving transfer')
		}
	}

	const safeTransferFrom = async (_id, _newOwner) => {
		try {
			const _oldOwner = await landContract.methods.ownerOf(_id).call()
			const _newOwner = account
			await landContract.methods.safeTransferFrom(_oldOwner, _newOwner, _id).send({ from: _newOwner })
			window.alert('Success, ownership of property transfered, you are now the new owner')
		}
		catch (error) {
			window.alert('Owner have not approved your transfer, Error occurred when safe transfer from')
		}


	}	



	return (
		<div>
			<Navbar cost={cost} web3Handler={web3Handler} reviseCost={reviseCost} account={account} />
			<Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
				<Sky distance={450000} sunPosition={[0,10,0]} inclination={0} azimuth={0.25} />

					<ambientLight intensity={0.5} />

					{/* Load in each cell */}
					<Physics>
						{buildings && buildings.map((building, index) => {
							if (building.owner === '0x0000000000000000000000000000000000000000') {
								return (
									<Plot
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
							} else {
								return (
									<Building
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY, building.sizeZ]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
							}
						})}
					</Physics>
					<Plane />
				</Suspense>
				<MapControls />
				<OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
			</Canvas>
			


			<Dialog
			open={AlertOpen}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			>
			<DialogTitle id="alert-dialog-title">{"Have you connected to your account?"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
				It seemed that you have not connect to your account. Please use metamask to connect to your account.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary" autoFocus>
				Cancel
				</Button>
			</DialogActions>
			</Dialog>


			{<div className="info2">
				<h2>Your account: </h2>
				{!account && <p>Please connect to your account</p>}
				{account && <p>{account}</p>}
				<h3>Your owned estates:</h3>
				
				{!account && <p>Null</p>}
				{account && buildings && buildings.map((building, index) => {
							if (building.owner === account) {
								return (
								<>
								<div style={{ display: "flex", alignItems: "center" }}>
									<p style={{ marginRight: "10px" }}>{building.name}</p>
									<p style={{ marginRight: "5px" }}>Purchase Price:</p>
									<p>{web3.utils.fromWei(buildings[index].purchasePrice.toString(), 'ether')} AXM</p>
								</div>
								<p style={{ marginRight: "5px" }}>Pending Request:</p>
								{buildings[index].operator !== "0x0000000000000000000000000000000000000000" ? (
									<p>{buildings[index].operator}</p>
								) : (
									<p>None</p>
								)}

								</>
								
						)}
				})}
			</div>
			}


			{landId && (
				<div className="info">
					<h1 className="flex">{landName}</h1>

					<div className='flex-left'>
						<div className='info--id'>
							<h2>ID</h2>
							<p>{landId}</p>
						</div>

						<div className='info--owner'>
							<h2>Owner</h2>
							<p>{landOwner}</p>
						</div>

						{!hasOwner && (
							<div className='info--owner'>
								<h2>Cost</h2>
								<p>{`${cost} AXM`}</p>
							</div>
						)}

					</div>

					{!hasOwner && (
						<>
							<label htmlFor="name-input">Enter the Land Name:</label>
							<input type="text" id="name-input" />
							<button onClick={() => buyHandler(landId)} className="button info--buy">
							Buy Property
							</button>
						</>
						)}
				

					{hasOwner && landOwner==account && (<FormDialog2 approveTransfer={approveTransfer} landId={landId}></FormDialog2>)} 


					<div className='flex-left'>
					{hasOwner && landOwner !== account && (
						<button onClick={() => requestTransfer(landId, account)} className="button info--requestbuy">
						Request transfer from owner
						</button>
					)}
					{hasOwner && landOwner !== account && (
						<button onClick={() => safeTransferFrom(landId, account)} className="button info--transfer">
						Buy from owner
						</button>
					)}
					</div>

				</div>
			)}
		</div>
	);
}

export default App;

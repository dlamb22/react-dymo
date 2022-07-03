import { useState } from 'react';
import {
	useDymoCheckService,
	useDymoFetchPrinters,
	useDymoOpenLabel,
	dymoRequestBuilder,
} from 'react-dymo-hooks';
import { dymo30252 } from './labels/dymo30252';
import { dymo30334 } from './labels/dymo30334';

export default function PrintLabel() {
	const statusDymoService = useDymoCheckService();
	const { statusFetchPrinters, printers } =
		useDymoFetchPrinters(statusDymoService);
	const { label, statusOpenLabel } = useDymoOpenLabel(
		statusDymoService,
		dymo30334
	);
	const [selectedPrinter, setSelectedPrinter] = useState('');

	// const style = { background: 'hsla(0, 0%, 50%, 0.66)', padding: 7 };
	// const loadingComponent = '<h4>Loading Preview...</h4>';
	// const errorComponent = '<h4>Error..</h4>';

	// if (statusOpenLabel === 'loading') {
	// 	return loadingComponent;
	// } else if (statusOpenLabel === 'error') {
	// 	return errorComponent;
	// } else if (statusOpenLabel === 'success') {
	// 	return (
	// 		<>
	// 			<img
	// 				src={'data:image/png;base64,' + label}
	// 				alt='dymo label preview'
	// 				style={style}
	// 			/>
	// 		</>
	// 	);
	// }

	console.log(selectedPrinter);

	const params = {
		data: `printerName=${encodeURIComponent(
			selectedPrinter
		)}&printParamsXml=&labelXml=${encodeURIComponent(dymo30334)}&labelSetXml=`,
	};

	function handlePrintLabel() {
		dymoRequestBuilder({
			method: 'POST',
			wsAction: 'printLabel',
			axiosOtherParams: params,
		})
			.then(res => {
				console.log(res);
			})
			.catch(error => {
				console.log(error);
			});
	}

	return (
		<div>
			{statusDymoService === 'loading' && <h1>Checking dymo web service...</h1>}
			{statusDymoService === 'error' && <h1>Error</h1>}
			{statusDymoService === 'success' && (
				<>
					<h3 style={{ color: 'green' }}>
						DYMO service is running in your PC.
					</h3>
				</>
			)}
			{statusFetchPrinters === 'loading' && <h4>Loading printers..</h4>}
			{statusFetchPrinters === 'success' && (
				<>
					<h4>Printers:</h4>
					<ul>
						{printers.map((printer, idx) => (
							<div key={idx}>
								<li key={printer.name}>{printer.name}</li>
								<button onClick={() => setSelectedPrinter(printer.name)}>
									Select Printer
								</button>
							</div>
						))}
					</ul>
					<button onClick={handlePrintLabel}>Print</button>
				</>
			)}
		</div>
	);
}

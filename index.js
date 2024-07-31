const AsarBundleRunner = require('asar-bundle-runner');
const asar = require('@electron/asar');
const { cpSync } = require('node:fs');
const path = require('node:path');
const { exec } = require('node:child_process');
/**
 * * Freedeck Developer Environment
 * Welcome!
 * - Edit the FDE_Settings object below to configure your environment.
 */

let name = 'WaveLink'
let bundleName = name + '.Freedeck'
// let bundleName = 'WaveLink.Freedeck'
const FDE_Settings = {
	test: false,
	UseScripts: true,
	BundlePrebuild: name,
	BundleName: bundleName,
	scripts: [],
	_abr_extract: "",
	_abr_run_output: ""
}

function buildPhase() {
	return new Promise((resolve, reject) => {
		console.log('Building!')
		asar.createPackage(FDE_Settings.BundlePrebuild + ".src",  path.resolve('./plugins/' + FDE_Settings.BundleName)).then(() => {
			console.log('Created ASAR package.')
			cpSync(path.resolve('./plugins',FDE_Settings.BundleName), path.resolve('./build/' + FDE_Settings.BundleName))
			console.log('Copied to plugins folder. Build completed.')
			if(!FDE_Settings.test) {console.log('No tests to do! Finished.'); return;}
			exec('npm i',{
				cwd: path.resolve(FDE_Settings.BundlePrebuild + ".src")
			}, (err, stdo, stde) => {
				console.log('Installed dependencies for package for testing')
				AsarBundleRunner.extract("./plugins/"+FDE_Settings.BundleName).then(bundleName => {
					console.log('Simulated extraction with ABR')
					AsarBundleRunner.run(bundleName).then(output => {
						console.log('Simulated initialization with ABR')
						FDE_Settings._abr_run_output = output
						resolve(true)
					}).catch(reject)
	
				}).catch(reject)
			})
		}).catch(console.error)
	})
}

buildPhase()
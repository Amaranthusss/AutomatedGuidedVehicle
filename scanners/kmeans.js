const _findKMeans = (arrayToProcess, Clusters) => {
	var Groups = [];
	var Centroids = [];
	var oldCentroids = [];
	var changed = false;
	var newGroup = 0;

	// initialise group arrays
	for (initGroups = 0; initGroups < Clusters; initGroups++) {
		Groups[initGroups] = new Array();
	}

	// pick initial centroids
	initialCentroids = Math.round(arrayToProcess.length / (Clusters + 1));

	for (i = 0; i < Clusters; i++) {
		Centroids[i] = arrayToProcess[(initialCentroids * (i + 1))];
	}
	do {
		for (j = 0; j < Clusters; j++) {
			Groups[j] = [];
		}
		changed = false;
		for (i = 0; i < arrayToProcess.length; i++) {
			Distance = -1;
			oldDistance = -1
			for (j = 0; j < Clusters; j++) {
				distance = Math.abs(Centroids[j] - arrayToProcess[i]);
				if (oldDistance == -1) {
					oldDistance = distance;
					newGroup = j;
				}
				else if (distance <= oldDistance) {
					newGroup = j;
					oldDistance = distance;
				}
			}
			Groups[newGroup].push(arrayToProcess[i]);
		}
		oldCentroids = Centroids;
		for (j = 0; j < Clusters; j++) {
			total = 0;
			newCentroid = 0;
			for (i = 0; i < Groups[j].length; i++) {
				total += Groups[j][i];
			}
			newCentroid = total / Groups[newGroup].length;
			Centroids[j] = newCentroid;
		}
		for (j = 0; j < Clusters; j++) {
			if (Centroids[j] != oldCentroids[j]) {
				changed = true;
			}
		}
	}
	while (changed == true);
	return Groups;
}

module.exports = class KMeans {
	constructor() {
		this.body = {
			data: [],
			k: 2,
			best: [],
			clusters: [],
			dist: 0
		}
		this.steps = {
			distsBest: [],
			grossErrorLimit: 20,
			grossErrorK: 2,
			sumBestDists: 0,
			beforeGrossError: [],
			skipSteps: false
		}
		this.nextK = 0;
	}
	async start(scannerOutput) {
		try {
			const step0 = () => { //Variables initialization
				return new Promise((resolve, reject) => {
					this.steps = {
						distsBest: [],
						grossErrorLimit: 20,
						grossErrorK: 2,
						sumBestDists: 0,
						beforeGrossError: [],
						skipSteps: false
					};
					this.body = {
						data: [],
						k: (2 + this.nextK),
						best: [],
						clusters: [],
						dist: 0
					};
					resolve();
				})
			}
			const step1 = () => { //k-Means algorithm for all input data
				return new Promise((resolve, reject) => {
					this.body.clusters = _findKMeans(scannerOutput.data, this.body.k); //Take clusters of k-Means
					resolve();
				})
			}
			const step2 = () => { //Find the best cluster and make a clusters' length test (repeat if required)
				return new Promise((resolve, reject) => {
					this.body.clusters.sort((a, b) => { return b.length - a.length }); //Sort clusters by length (DESC)
					if (this.nextK < (scannerOutput.data.length - 1)) {
						if ((this.body.clusters[0].length - this.body.clusters[1].length) == 0
							&& (this.body.k < scannerOutput.data.length)) { //Clusters've same length so need higher k
							this.steps.skipSteps = true;
							this.nextK++;
						} else
							this.nextK = 0;
					} else
						console.log('Limit has been reached for clustring');

					this.body.best = this.body.clusters[0];
					resolve();
				})
			}
			const step3 = () => { //Estimate distances between the best cluster's points and make a gross error test
				return new Promise((resolve, reject) => {
					this.body.best.sort((a, b) => { return b - a }); //Sort best cluster (DESC)
					for (let i = 1; i < this.body.best.length; i++) { //Estimate distances between the best cluster's points
						this.steps.distsBest.push(this.body.best[i - 1] - this.body.best[i]);
					}
					for (let i = 0; i < this.steps.distsBest.length; i++) { //Define gross error - if some distance is higher than CONST cm
						if (this.steps.distsBest[i] > this.steps.grossErrorLimit) {//If some distance is too high
							this.steps.grossErrorK++;
						}
					}
					this.steps.beforeGrossError = this.body.best;
					if (this.steps.grossErrorK > 0)
						this.body.best = _findKMeans(this.body.best, this.steps.grossErrorK).sort((a, b) => { return b.length - a.length })[0];
					resolve();
				})
			}
			const step4 = () => { //Calculate sensor' output distance of the package (arithmetic average)
				return new Promise((resolve, reject) => {
					for (let i = 0; i < this.body.best.length; i++)
						this.steps.sumBestDists = this.steps.sumBestDists + this.body.best[i];
					this.body.dist = this.steps.sumBestDists / this.body.best.length;
					resolve();
				})
			}
			const step5 = () => { //Sort data points (ASC)
				return new Promise((resolve, reject) => {
					this.body.data = scannerOutput.data.sort((b, a) => { return b - a });
					resolve();
				})
			}
			const step6 = () => { //Console.log
				return new Promise((resolve, reject) => {
					let out = {
						grossErrorK: this.steps.grossErrorK,
						distsBest: this.steps.distsBest,
						data: this.body.data,
						clusters: this.body.clusters,
						bestBeforeGrossError: this.steps.beforeGrossError,
						best: this.body.best,
						dist: this.body.dist,
						nextK: this.nextK
					}
					if (out.dist > 10 && out.dist < 200)
						console.log(out.dist);
					resolve();
				})
			}
			if (scannerOutput.data.length > 0) {
				await step0(); //Variables initialization
				await step1(); //k-Means algorithm for all input data
				await step2(); //Find the best cluster and make a clusters' length test (repeat if required)
				if (this.steps.skipSteps == false) {
					await step3(); //Estimate distances between the best cluster's points and make a gross error test
					await step4(); //Calculate sensor' output distance of the package (arithmetic average)
					await step5(); //Sort data points (ASC)
					//await step6(); //Console.log
				} else
					await this.start(scannerOutput); //Repeat all functions

			};
		} catch (e) { '[Error] ' + console.log(e) }
	}
}

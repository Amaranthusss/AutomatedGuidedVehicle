const findKMeans = (arrayToProcess, Clusters) => {
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

class KMeans {
	constructor() {
		this.body = {
			data: [],
			k: 2,
			best: [],
			clusters: [],
			dist: 0
		}
	}
	async start(scannerOutput) {
		try {
			const step1 = () => {
				return new Promise((resolve, reject) => {
					this.body.clusters = findKMeans(scannerOutput.distances, this.body.k); //Take clusters of k-Means
					resolve();
				})
			}
			const step2 = () => {
				return new Promise((resolve, reject) => {
					this.body.clusters.sort((a, b) => { return b.length - a.length }); //Sort clusters by length (DESC)
					if ((this.body.clusters[0].length - this.body.clusters[1].length) == 0
						&& (this.body.k < scannerOutput.distances.length) ) { //Clusters've same length so need higher k
						this.body.k++;
						step1();
						step2();
					}
					this.body.best = this.body.clusters[0];
					//ToDo: OBLICZYĆ DYSTANSE POMIĘDZY BEST I W PRZYPADKU ZBYT DUŻEGO PROCENTA ODCHYŁKI K-MEANS DLA BEST OSTATECZNIE
					let sumBestDists = 0;
					for (let i = 0; i < this.body.best.length; i++)
						sumBestDists = sumBestDists + this.body.best[i];
					this.body.dist = sumBestDists / this.body.best.length;
					resolve();
				})
			}
			if (scannerOutput.sum > 0) {
				await step1();
				await step2();
			};
			this.body.data = scannerOutput.distances.sort((b, a) => { return b - a });  //Sort data points (ASC)
		} catch (e) { '[Error] ' + console.log(e) }
	}
	return() {
		return this.body;
	}
}
var frontScannerKMeans = new KMeans();
module.exports.frontScanner = frontScannerKMeans;
/**
 * Simple Anomaly Detection using Statistical Methods
 * (No ML library needed for basic implementation)
 */

interface Metric {
  value: number;
  timestamp: Date;
}

export class AnomalyDetector {
  private historicalData: number[] = [];
  private threshold: number = 2; // Standard deviations

  /**
   * Train the detector with historical data
   */
  train(data: number[]) {
    this.historicalData = data;
  }

  /**
   * Detect if a value is anomalous using Z-score method
   */
  detect(value: number): { isAnomaly: boolean; score: number; confidence: number } {
    if (this.historicalData.length < 10) {
      return { isAnomaly: false, score: 0, confidence: 0 };
    }

    const mean = this.calculateMean(this.historicalData);
    const stdDev = this.calculateStdDev(this.historicalData, mean);
    
    // Z-score: how many standard deviations away from mean
    const zScore = Math.abs((value - mean) / stdDev);
    
    const isAnomaly = zScore > this.threshold;
    const confidence = Math.min(zScore / this.threshold * 100, 100);

    return {
      isAnomaly,
      score: zScore,
      confidence: Math.round(confidence)
    };
  }

  /**
   * Detect anomalies in time series data
   */
  detectTimeSeries(data: Metric[]): Metric[] {
    const anomalies: Metric[] = [];
    
    for (let i = 10; i < data.length; i++) {
      const window = data.slice(i - 10, i).map(m => m.value);
      this.train(window);
      
      const result = this.detect(data[i].value);
      if (result.isAnomaly) {
        anomalies.push(data[i]);
      }
    }
    
    return anomalies;
  }

  private calculateMean(data: number[]): number {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  private calculateStdDev(data: number[], mean: number): number {
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }
}

// Example usage:
// const detector = new AnomalyDetector();
// detector.train([100, 102, 98, 101, 99, 103, 97, 100, 102, 98]);
// const result = detector.detect(150); // { isAnomaly: true, score: 5.2, confidence: 100 }

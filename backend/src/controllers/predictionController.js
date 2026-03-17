const { spawn } = require('child_process');
const path = require('path');
const Doctor = require('../models/Doctor');

const PYTHON_EXECUTABLE = process.env.PYTHON || 'python';
const SCRIPT_PATH = path.join(__dirname, '..', '..', 'chatbot', 'predict.py');

const runPythonPrediction = (symptoms) => {
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_EXECUTABLE, [SCRIPT_PATH], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `Python exited with code ${code}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse python output: ${err.message}`));
      }
    });

    child.stdin.write(JSON.stringify({ symptoms }));
    child.stdin.end();
  });
};

exports.predict = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || typeof symptoms !== 'object') {
      return res.status(400).json({ message: 'Invalid payload. Provide a symptoms object.' });
    }

    const prediction = await runPythonPrediction(symptoms);

    const specialist = prediction.specialist || prediction.recommendedSpecialist || '';
    const doctorQuery = specialist ? { Specialization: new RegExp(specialist, 'i') } : {};

    const doctors = await Doctor.find(doctorQuery).limit(10).lean();

    res.json({ ...prediction, doctors });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
};

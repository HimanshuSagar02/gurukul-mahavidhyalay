import mongoose from 'mongoose';

const admissionSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    aadhaarEncrypted: {
      type: String,
      required: true,
      trim: true
    },
    marksPercentage: {
      type: String,
      required: true,
      trim: true
    },
    selectedSubjects: {
      type: [String],
      default: []
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export const AdmissionSubmission = mongoose.model('AdmissionSubmission', admissionSubmissionSchema);

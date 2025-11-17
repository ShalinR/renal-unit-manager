import * as XLSX from 'xlsx';

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma or quote
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  });
  
  // Create blob and download
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel format
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Write file
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Export investigation data to CSV/Excel
 */
export function exportInvestigationData(
  data: any[],
  filename: string,
  format: 'csv' | 'excel' = 'excel'
) {
  if (format === 'csv') {
    exportToCSV(data, filename);
  } else {
    exportToExcel(data, filename, 'Investigation Data');
  }
}

/**
 * Convert PD Investigation summary to flat array for export
 */
export function flattenPDInvestigationData(summary: any, parameters: any[]) {
  const rows: any[] = [];
  
  if (!summary || !summary.dates || summary.dates.length === 0) {
    return rows;
  }

  // Create a row for each parameter
  parameters.forEach(param => {
    const row: any = {
      'Investigation': param.name,
      'Unit': param.unit || '',
    };
    
    // Add values for each date
    summary.dates.forEach((date: string, index: number) => {
      const value = summary.values[param.id]?.[date] || '';
      row[`Date ${index + 1} (${date})`] = value;
    });
    
    rows.push(row);
  });
  
  return rows;
}

/**
 * Convert HD Investigation data to export format
 */
export function flattenHDInvestigationData(data: any) {
  return [{
    'Patient ID': data.patientId || '',
    'Date': data.date || '',
    'Creatinine (mg/dL)': data.creatinine || '',
    'eGFR (mL/min/1.73m²)': data.eGFR || '',
    'Serum Na (mEq/L)': data.seNa || '',
    'Serum K (mEq/L)': data.seK || '',
    'Serum Ca (mg/dL)': data.sCa || '',
    'Serum PO4 (mg/dL)': data.sPO4 || '',
    'Hemoglobin (g/dL)': data.seHb || '',
    'Kt/V': data.ktV || '',
    'Albumin (g/dL)': data.sAlbumin || '',
    'Notes': data.notes || '',
  }];
}

/**
 * Convert KT Investigation data to export format
 */
export function flattenKTInvestigationData(data: any) {
  const flatData: any = {
    'Patient ID': data.patientId || '',
    'Date': data.date || '',
    'Date of KT': data.dateOfKT || '',
    'Type of KT': data.typeOfKT || '',
    'Post KT Duration': data.postKTDuration || '',
    'Body Weight (kg)': data.bw || '',
    'Height (cm)': data.height || '',
    'BMI': data.bmi || '',
    'Blood Pressure': data.bp || '',
    'Tacrolimus (ng/mL)': data.tacrolimus || '',
    'S. Creatinine': data.creatinine || '',
    'eGFR': data.eGFR || '',
    'Serum Na+': data.seNa || '',
    'Serum K+': data.seK || '',
    'Hemoglobin': data.hb || '',
    'PCV': data.pcv || '',
    'WBC Total': data.wbcTotal || '',
    'Neutrophils (N)': data.wbcN || '',
    'Lymphocytes (L)': data.wbcL || '',
    'Platelet Count': data.platelet || '',
    'Urine Protein': data.urineProtein || '',
    'Urine Pus Cells': data.urinePusCells || '',
    'Urine RBC': data.urineRBC || '',
    'Urine PCR': data.urinePCR || '',
    'S. Calcium': data.sCalcium || '',
    'S. Phosphate': data.sPhosphate || '',
    'FBS': data.fbs || '',
    'PPBS': data.ppbs || '',
    'HbA1c': data.hba1c || '',
    'Total Cholesterol': data.cholesterolTotal || '',
    'Triglycerides': data.triglycerides || '',
    'HDL': data.hdl || '',
    'LDL': data.ldl || '',
    'S. Albumin': data.sAlbumin || '',
    'ALP': data.alp || '',
    'Uric Acid': data.uricAcid || '',
    'ALT': data.alt || '',
    'AST': data.ast || '',
    'S. Bilirubin': data.sBilirubin || '',
  };

  // Add annual-specific fields if present
  if (data.annualScreening !== undefined) {
    flatData['Annual Screening'] = data.annualScreening || '';
    flatData['CMV PCR'] = data.cmvPCR || '';
    flatData['BKV PCR'] = data.bkvPCR || '';
    flatData['EBV PCR'] = data.ebvPCR || '';
    flatData['Hep B Surface Antigen'] = data.hepBsAg || '';
    flatData['Hep C Antibody'] = data.hepCAb || '';
    flatData['HIV Antibody'] = data.hivAb || '';
    flatData['Urine Cytology'] = data.urineCytology || '';
    flatData['PTH'] = data.pth || '';
    flatData['Vitamin D'] = data.vitD || '';
    flatData['US KUB / Renal Doppler'] = data.imagingUS_KUB_Pelvis_RenalDoppler || '';
    flatData['CXR'] = data.imagingCXR || '';
    flatData['ECG'] = data.imagingECG || '';
    flatData['2D Echo'] = data.imaging2DEcho || '';
    flatData['Blood Picture'] = data.hematologyBloodPicture || '';
    flatData['Breast Screen'] = data.breastScreen || '';
    flatData['PSA'] = data.psa || '';
    flatData['Pap Smear'] = data.papSmear || '';
    flatData['Stool Occult Blood'] = data.stoolOccultBlood || '';
    flatData['Endoscopy'] = data.proceduresEndoscopy || '';
    flatData['Dental Review'] = data.specialistDental || '';
    flatData['Ophthalmology Review'] = data.specialistOphthalmology || '';
  }

  flatData['Notes'] = data.notes || '';

  return [flatData];
}

/**
 * Convert Peritoneal Dialysis data to export format
 */
export function flattenPeritonealData(capdData: any) {
  const rows: any[] = [];
  
  if (!capdData) {
    return rows;
  }

  // Basic Information
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Counselling Date',
    'Value': capdData.counsellingDate || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Catheter Insertion Date',
    'Value': capdData.catheterInsertionDate || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Insertion Done By',
    'Value': capdData.insertionDoneBy || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Insertion Place',
    'Value': capdData.insertionPlace || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Technique',
    'Value': capdData.technique || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Designation',
    'Value': capdData.designation || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'First Flushing',
    'Value': capdData.firstFlushing || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Second Flushing',
    'Value': capdData.secondFlushing || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Third Flushing',
    'Value': capdData.thirdFlushing || '',
  });
  rows.push({
    'Category': 'Basic Information',
    'Field': 'Initiation Date',
    'Value': capdData.initiationDate || '',
  });

  // PET Results
  if (capdData.petResults) {
    ['first', 'second', 'third'].forEach((key, index) => {
      const pet = capdData.petResults[key];
      if (pet && pet.date) {
        rows.push({
          'Category': 'PET Test',
          'Field': `PET Test ${index + 1} - Date`,
          'Value': pet.date,
        });
        if (pet.data) {
          Object.entries(pet.data).forEach(([field, value]) => {
            rows.push({
              'Category': 'PET Test',
              'Field': `PET Test ${index + 1} - ${field}`,
              'Value': String(value || ''),
            });
          });
        }
      }
    });
  }

  // Adequacy Results
  if (capdData.adequacyResults) {
    ['first', 'second', 'third'].forEach((key, index) => {
      const adequacy = capdData.adequacyResults[key];
      if (adequacy && adequacy.date) {
        rows.push({
          'Category': 'Adequacy Test',
          'Field': `Adequacy Test ${index + 1} - Date`,
          'Value': adequacy.date,
        });
        if (adequacy.data) {
          Object.entries(adequacy.data).forEach(([field, value]) => {
            rows.push({
              'Category': 'Adequacy Test',
              'Field': `Adequacy Test ${index + 1} - ${field}`,
              'Value': String(value || ''),
            });
          });
        }
      }
    });
  }

  // Infection Tracking
  if (capdData.peritonitisHistory && capdData.peritonitisHistory.length > 0) {
    capdData.peritonitisHistory.forEach((episode: any, index: number) => {
      rows.push({
        'Category': 'Peritonitis',
        'Field': `Episode ${index + 1} - Date`,
        'Value': episode.episodeDate || '',
      });
      Object.entries(episode).forEach(([key, value]) => {
        if (key !== 'episodeDate') {
          rows.push({
            'Category': 'Peritonitis',
            'Field': `Episode ${index + 1} - ${key}`,
            'Value': String(value || ''),
          });
        }
      });
    });
  }

  if (capdData.exitSiteInfections && capdData.exitSiteInfections.length > 0) {
    capdData.exitSiteInfections.forEach((episode: any, index: number) => {
      rows.push({
        'Category': 'Exit Site Infection',
        'Field': `Episode ${index + 1} - Date`,
        'Value': episode.dateOnset || '',
      });
      Object.entries(episode).forEach(([key, value]) => {
        if (key !== 'dateOnset') {
          rows.push({
            'Category': 'Exit Site Infection',
            'Field': `Episode ${index + 1} - ${key}`,
            'Value': String(value || ''),
          });
        }
      });
    });
  }

  if (capdData.tunnelInfections && capdData.tunnelInfections.length > 0) {
    capdData.tunnelInfections.forEach((episode: any, index: number) => {
      rows.push({
        'Category': 'Tunnel Infection',
        'Field': `Episode ${index + 1} - Date`,
        'Value': episode.episodeDate || '',
      });
      Object.entries(episode).forEach(([key, value]) => {
        if (key !== 'episodeDate') {
          rows.push({
            'Category': 'Tunnel Infection',
            'Field': `Episode ${index + 1} - ${key}`,
            'Value': String(value || ''),
          });
        }
      });
    });
  }

  return rows;
}



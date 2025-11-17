-- Add anthropometric columns to kt_surgery
ALTER TABLE kt_surgery
  ADD COLUMN height_cm VARCHAR(20),
  ADD COLUMN weight_kg VARCHAR(20),
  ADD COLUMN bmi VARCHAR(20);

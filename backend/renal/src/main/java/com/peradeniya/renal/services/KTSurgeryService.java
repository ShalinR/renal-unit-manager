package com.peradeniya.renal.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.peradeniya.renal.dto.KTSurgeryDTO;
import com.peradeniya.renal.dto.MedicationDTO;
import com.peradeniya.renal.model.KTSurgery;
import com.peradeniya.renal.repository.KTSurgeryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KTSurgeryService {

    @Autowired
    private KTSurgeryRepository ktSurgeryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public KTSurgeryDTO createKTSurgery(KTSurgeryDTO ktSurgeryDTO) {
        System.out.println("🔵 [KTSurgeryService] Converting DTO to entity for patient: " + ktSurgeryDTO.getPatientPhn());
        System.out.println("   DTO PHN: [" + ktSurgeryDTO.getPatientPhn() + "]");
        KTSurgery ktSurgery = convertToEntity(ktSurgeryDTO);
        System.out.println("💾 [KTSurgeryService] Saving entity to database...");
        System.out.println("   Entity PHN before save: [" + ktSurgery.getPatientPhn() + "]");
        KTSurgery saved = ktSurgeryRepository.save(ktSurgery);
        System.out.println("✅ [KTSurgeryService] Saved with ID: " + saved.getId() + ", PHN: [" + saved.getPatientPhn() + "]");
        KTSurgeryDTO result = convertToDTO(saved);
        System.out.println("📦 [KTSurgeryService] Converted back to DTO: " + result);
        return result;
    }

    public Optional<KTSurgeryDTO> getKTSurgeryByPatientPhn(String patientPhn) {
        System.out.println("🔍 [KTSurgeryService] Searching for KT Surgery with PHN: [" + patientPhn + "]");
        System.out.println("   PHN length: " + (patientPhn != null ? patientPhn.length() : "NULL"));
        System.out.println("   PHN type: " + (patientPhn != null ? patientPhn.getClass().getName() : "NULL"));
        
        // Also try fetching ALL records to see what's in the database
        List<KTSurgery> allRecords = ktSurgeryRepository.findAllByPatientPhn(patientPhn);
        System.out.println("   Found " + allRecords.size() + " records with this PHN");
        
        Optional<KTSurgery> result = ktSurgeryRepository.findByPatientPhn(patientPhn);
        if (result.isPresent()) {
            System.out.println("✅ [KTSurgeryService] Found: ID=" + result.get().getId() + ", Stored PHN=[" + result.get().getPatientPhn() + "]");
        } else {
            System.out.println("⚠️ [KTSurgeryService] Not found in database");
            System.out.println("   Attempting to list all KT Surgeries in database:");
            List<KTSurgery> allSurgeries = ktSurgeryRepository.findAll();
            for (KTSurgery surgery : allSurgeries) {
                System.out.println("     - ID: " + surgery.getId() + ", PHN: [" + surgery.getPatientPhn() + "]");
            }
        }
        return result.map(this::convertToDTO);
    }

    public List<KTSurgeryDTO> getAllKTSurgeriesByPatientPhn(String patientPhn) {
        return ktSurgeryRepository.findAllByPatientPhn(patientPhn)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public KTSurgeryDTO updateKTSurgery(String patientPhn, KTSurgeryDTO ktSurgeryDTO) {
        Optional<KTSurgery> existing = ktSurgeryRepository.findByPatientPhn(patientPhn);
        if (existing.isPresent()) {
            KTSurgery ktSurgery = convertToEntity(ktSurgeryDTO);
            ktSurgery.setId(existing.get().getId());
            KTSurgery updated = ktSurgeryRepository.save(ktSurgery);
            return convertToDTO(updated);
        }
        throw new RuntimeException("KT Surgery not found for patient: " + patientPhn);
    }

    public boolean existsByPatientPhn(String patientPhn) {
        return ktSurgeryRepository.existsByPatientPhn(patientPhn);
    }

    public Optional<KTSurgeryDTO> getLatestKTSurgeryByPatientPhn(String patientPhn) {
        List<KTSurgery> surgeries = ktSurgeryRepository.findByPatientPhnOrderByKtDateDesc(patientPhn);
        if (surgeries.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(convertToDTO(surgeries.get(0)));
    }

    private KTSurgery convertToEntity(KTSurgeryDTO dto) {
        KTSurgery entity = new KTSurgery();

        // Basic patient info
        entity.setPatientPhn(dto.getPatientPhn());
        entity.setName(dto.getName());
        entity.setDob(dto.getDob());
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setAddress(dto.getAddress());
        entity.setContact(dto.getContact());
        // Anthropometrics
        entity.setHeight(dto.getHeight());
        entity.setWeight(dto.getWeight());
        entity.setBmi(dto.getBmi());

        // Medical History
        entity.setDiabetes(dto.getDiabetes());
        entity.setHypertension(dto.getHypertension());
        entity.setIhd(dto.getIhd());
        entity.setDyslipidaemia(dto.getDyslipidaemia());
        entity.setOther(dto.getOther());
        entity.setOtherSpecify(dto.getOtherSpecify());
        entity.setPrimaryDiagnosis(dto.getPrimaryDiagnosis());
        entity.setModeOfRRT(dto.getModeOfRRT());
        entity.setDurationRRT(dto.getDurationRRT());

        // Transplantation Details
        entity.setKtDate(dto.getKtDate());
        entity.setNumberOfKT(dto.getNumberOfKT());
        entity.setKtUnit(dto.getKtUnit());
        entity.setWardNumber(dto.getWardNumber());
        entity.setKtSurgeon(dto.getKtSurgeon());
        entity.setKtType(dto.getKtType());
        entity.setDonorRelationship(dto.getDonorRelationship());
        entity.setPeritonealPosition(dto.getPeritonealPosition());
        entity.setSideOfKT(dto.getSideOfKT());

        // Immunosuppression
        entity.setPreKT(dto.getPreKT());
        entity.setInductionTherapy(dto.getInductionTherapy());
        entity.setMaintenance(dto.getMaintenance());
        entity.setMaintenanceOther(dto.getMaintenanceOther());
        entity.setMaintenancePred(dto.getMaintenancePred());
        entity.setMaintenanceMMF(dto.getMaintenanceMMF());
        entity.setMaintenanceTac(dto.getMaintenanceTac());
        entity.setMaintenanceEverolimus(dto.getMaintenanceEverolimus());
        entity.setMaintenanceOtherText(dto.getMaintenanceOtherText());

        // Immunological Details
        if (dto.getImmunologicalDetails() != null) {
            entity.setImmunologicalDetails(dto.getImmunologicalDetails());
        }

        // Infection Screen
        entity.setCmvDonor(dto.getCmvDonor());
        entity.setCmvRecipient(dto.getCmvRecipient());
        entity.setEbvDonor(dto.getEbvDonor());
        entity.setEbvRecipient(dto.getEbvRecipient());
        entity.setCmvRiskCategory(dto.getCmvRiskCategory());
        entity.setEbvRiskCategory(dto.getEbvRiskCategory());
        entity.setTbMantoux(dto.getTbMantoux());
        entity.setHivAb(dto.getHivAb());
        entity.setHepBsAg(dto.getHepBsAg());
        entity.setHepCAb(dto.getHepCAb());
        entity.setInfectionRiskCategory(dto.getInfectionRiskCategory());

        // Prophylaxis
        entity.setCotrimoxazoleYes(dto.getCotrimoxazoleYes());
        entity.setCotriDuration(dto.getCotriDuration());
        entity.setCotriStopped(dto.getCotriStopped());
        entity.setValganciclovirYes(dto.getValganciclovirYes());
        entity.setValganDuration(dto.getValganDuration());
        entity.setValganStopped(dto.getValganStopped());

        // Vaccination
        entity.setVaccinationCOVID(dto.getVaccinationCOVID());
        entity.setVaccinationInfluenza(dto.getVaccinationInfluenza());
        entity.setVaccinationPneumococcal(dto.getVaccinationPneumococcal());
        entity.setVaccinationVaricella(dto.getVaccinationVaricella());

        // Pre-operative
        entity.setPreOpStatus(dto.getPreOpStatus());
        entity.setPreOpPreparation(dto.getPreOpPreparation());
        entity.setSurgicalNotes(dto.getSurgicalNotes());

        // Immediate Post-Transplant
        entity.setPreKTCreatinine(dto.getPreKTCreatinine());
        entity.setPostKTCreatinine(dto.getPostKTCreatinine());
        entity.setDelayedGraftYes(dto.getDelayedGraftYes());
        entity.setPostKTDialysisYes(dto.getPostKTDialysisYes());
        entity.setPostKTPDYes(dto.getPostKTPDYes());
        entity.setAcuteRejectionYes(dto.getAcuteRejectionYes());
        entity.setAcuteRejectionDetails(dto.getAcuteRejectionDetails());
        entity.setOtherComplications(dto.getOtherComplications());

        // Surgery Complications
        entity.setPostKTComp1(dto.getPostKTComp1());
        entity.setPostKTComp2(dto.getPostKTComp2());
        entity.setPostKTComp3(dto.getPostKTComp3());
        entity.setPostKTComp4(dto.getPostKTComp4());
        entity.setPostKTComp5(dto.getPostKTComp5());
        entity.setPostKTComp6(dto.getPostKTComp6());

        // Medications (serialize to JSON)
        if (dto.getMedications() != null) {
            try {
                entity.setMedications(objectMapper.writeValueAsString(dto.getMedications()));
            } catch (Exception e) {
                entity.setMedications("[]");
            }
        }

        // Final
        entity.setRecommendations(dto.getRecommendations());
        entity.setFilledBy(dto.getFilledBy());

        return entity;
    }

    private KTSurgeryDTO convertToDTO(KTSurgery entity) {
        KTSurgeryDTO dto = new KTSurgeryDTO();

        // Basic patient info
        dto.setId(entity.getId());
        dto.setPatientPhn(entity.getPatientPhn());
        dto.setName(entity.getName());
        dto.setDob(entity.getDob());
        dto.setAge(entity.getAge());
        dto.setGender(entity.getGender());
        dto.setAddress(entity.getAddress());
        dto.setContact(entity.getContact());
        // Anthropometrics
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setBmi(entity.getBmi());

        // Medical History
        dto.setDiabetes(entity.getDiabetes());
        dto.setHypertension(entity.getHypertension());
        dto.setIhd(entity.getIhd());
        dto.setDyslipidaemia(entity.getDyslipidaemia());
        dto.setOther(entity.getOther());
        dto.setOtherSpecify(entity.getOtherSpecify());
        dto.setPrimaryDiagnosis(entity.getPrimaryDiagnosis());
        dto.setModeOfRRT(entity.getModeOfRRT());
        dto.setDurationRRT(entity.getDurationRRT());

        // Transplantation Details
        dto.setKtDate(entity.getKtDate());
        dto.setNumberOfKT(entity.getNumberOfKT());
        dto.setKtUnit(entity.getKtUnit());
        dto.setWardNumber(entity.getWardNumber());
        dto.setKtSurgeon(entity.getKtSurgeon());
        dto.setKtType(entity.getKtType());
        dto.setDonorRelationship(entity.getDonorRelationship());
        dto.setPeritonealPosition(entity.getPeritonealPosition());
        dto.setSideOfKT(entity.getSideOfKT());

        // Immunosuppression
        dto.setPreKT(entity.getPreKT());
        dto.setInductionTherapy(entity.getInductionTherapy());
        dto.setMaintenance(entity.getMaintenance());
        dto.setMaintenanceOther(entity.getMaintenanceOther());
        dto.setMaintenancePred(entity.getMaintenancePred());
        dto.setMaintenanceMMF(entity.getMaintenanceMMF());
        dto.setMaintenanceTac(entity.getMaintenanceTac());
        dto.setMaintenanceEverolimus(entity.getMaintenanceEverolimus());
        dto.setMaintenanceOtherText(entity.getMaintenanceOtherText());

        // Immunological Details
        dto.setImmunologicalDetails(entity.getImmunologicalDetails());

        // Infection Screen
        dto.setCmvDonor(entity.getCmvDonor());
        dto.setCmvRecipient(entity.getCmvRecipient());
        dto.setEbvDonor(entity.getEbvDonor());
        dto.setEbvRecipient(entity.getEbvRecipient());
        dto.setCmvRiskCategory(entity.getCmvRiskCategory());
        dto.setEbvRiskCategory(entity.getEbvRiskCategory());
        dto.setTbMantoux(entity.getTbMantoux());
        dto.setHivAb(entity.getHivAb());
        dto.setHepBsAg(entity.getHepBsAg());
        dto.setHepCAb(entity.getHepCAb());
        dto.setInfectionRiskCategory(entity.getInfectionRiskCategory());

        // Prophylaxis
        dto.setCotrimoxazoleYes(entity.getCotrimoxazoleYes());
        dto.setCotriDuration(entity.getCotriDuration());
        dto.setCotriStopped(entity.getCotriStopped());
        dto.setValganciclovirYes(entity.getValganciclovirYes());
        dto.setValganDuration(entity.getValganDuration());
        dto.setValganStopped(entity.getValganStopped());

        // Vaccination
        dto.setVaccinationCOVID(entity.getVaccinationCOVID());
        dto.setVaccinationInfluenza(entity.getVaccinationInfluenza());
        dto.setVaccinationPneumococcal(entity.getVaccinationPneumococcal());
        dto.setVaccinationVaricella(entity.getVaccinationVaricella());

        // Pre-operative
        dto.setPreOpStatus(entity.getPreOpStatus());
        dto.setPreOpPreparation(entity.getPreOpPreparation());
        dto.setSurgicalNotes(entity.getSurgicalNotes());

        // Immediate Post-Transplant
        dto.setPreKTCreatinine(entity.getPreKTCreatinine());
        dto.setPostKTCreatinine(entity.getPostKTCreatinine());
        dto.setDelayedGraftYes(entity.getDelayedGraftYes());
        dto.setPostKTDialysisYes(entity.getPostKTDialysisYes());
        dto.setPostKTPDYes(entity.getPostKTPDYes());
        dto.setAcuteRejectionYes(entity.getAcuteRejectionYes());
        dto.setAcuteRejectionDetails(entity.getAcuteRejectionDetails());
        dto.setOtherComplications(entity.getOtherComplications());

        // Surgery Complications
        dto.setPostKTComp1(entity.getPostKTComp1());
        dto.setPostKTComp2(entity.getPostKTComp2());
        dto.setPostKTComp3(entity.getPostKTComp3());
        dto.setPostKTComp4(entity.getPostKTComp4());
        dto.setPostKTComp5(entity.getPostKTComp5());
        dto.setPostKTComp6(entity.getPostKTComp6());

        // Medications (deserialize from JSON)
        if (entity.getMedications() != null && !entity.getMedications().isEmpty()) {
            try {
                List<MedicationDTO> medications = objectMapper.readValue(
                        entity.getMedications(),
                        new TypeReference<List<MedicationDTO>>() {}
                );
                dto.setMedications(medications);
            } catch (Exception e) {
                dto.setMedications(List.of());
            }
        } else {
            dto.setMedications(List.of());
        }

        // Final
        dto.setRecommendations(entity.getRecommendations());
        dto.setFilledBy(entity.getFilledBy());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}
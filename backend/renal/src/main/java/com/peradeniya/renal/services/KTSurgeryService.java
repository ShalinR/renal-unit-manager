package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.KTSurgeryDTO;
import com.peradeniya.renal.model.KTSurgery;
import com.peradeniya.renal.repository.KTSurgeryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KTSurgeryService {

    @Autowired
    private KTSurgeryRepository ktSurgeryRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public KTSurgeryDTO createKTSurgery(KTSurgeryDTO ktSurgeryDTO) {
        KTSurgery ktSurgery = convertToEntity(ktSurgeryDTO);
        KTSurgery saved = ktSurgeryRepository.save(ktSurgery);
        return convertToDTO(saved);
    }

    public Optional<KTSurgeryDTO> getKTSurgeryByPatientPhn(String patientPhn) {
        return ktSurgeryRepository.findByPatientPhn(patientPhn)
                .map(this::convertToDTO);
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
        entity.setPatientPhn(dto.getPatientPhn());
        entity.setName(dto.getName());
        entity.setDob(parseDate(dto.getDob()));
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setAddress(dto.getAddress());
        entity.setContact(dto.getContact());
        entity.setDiabetes(dto.getDiabetes());
        entity.setHypertension(dto.getHypertension());
        entity.setIhd(dto.getIhd());
        entity.setDyslipidaemia(dto.getDyslipidaemia());
        entity.setOther(dto.getOther());
        entity.setOtherSpecify(dto.getOtherSpecify());
        entity.setPrimaryDiagnosis(dto.getPrimaryDiagnosis());
        entity.setModeOfRRT(dto.getModeOfRRT());
        entity.setDurationRRT(dto.getDurationRRT());
        entity.setKtDate(parseDate(dto.getKtDate()));
        entity.setNumberOfKT(dto.getNumberOfKT());
        entity.setKtUnit(dto.getKtUnit());
        entity.setWardNumber(dto.getWardNumber());
        entity.setKtSurgeon(dto.getKtSurgeon());
        entity.setKtType(dto.getKtType());
        entity.setDonorRelationship(dto.getDonorRelationship());
        entity.setPeritonealPosition(dto.getPeritonealPosition());
        entity.setSideOfKT(dto.getSideOfKT());
        entity.setPreKT(dto.getPreKT());
        entity.setInductionTherapy(dto.getInductionTherapy());
        entity.setMaintenance(dto.getMaintenance());
        entity.setMaintenanceOther(dto.getMaintenanceOther());
        entity.setCotrimoxazole(dto.getCotrimoxazole());
        entity.setCotriDuration(dto.getCotriDuration());
        entity.setCotriStopped(parseDate(dto.getCotriStopped()));
        entity.setValganciclovir(dto.getValganciclovir());
        entity.setValganDuration(dto.getValganDuration());
        entity.setValganStopped(parseDate(dto.getValganStopped()));
        entity.setVaccination(dto.getVaccination());
        entity.setPreOpStatus(dto.getPreOpStatus());
        entity.setPreOpPreparation(dto.getPreOpPreparation());
        entity.setSurgicalNotes(dto.getSurgicalNotes());
        entity.setPreKTCreatinine(dto.getPreKTCreatinine());
        entity.setPostKTCreatinine(dto.getPostKTCreatinine());
        entity.setDelayedGraft(dto.getDelayedGraft());
        entity.setPostKTDialysis(dto.getPostKTDialysis());
        entity.setAcuteRejection(dto.getAcuteRejection());
        entity.setAcuteRejectionDetails(dto.getAcuteRejectionDetails());
        entity.setOtherComplications(dto.getOtherComplications());
        entity.setPostKTComp1(dto.getPostKTComp1());
        entity.setPostKTComp2(dto.getPostKTComp2());
        entity.setPostKTComp3(dto.getPostKTComp3());
        entity.setPostKTComp4(dto.getPostKTComp4());
        entity.setPostKTComp5(dto.getPostKTComp5());
        entity.setPostKTComp6(dto.getPostKTComp6());
        entity.setCurrentMeds(dto.getCurrentMeds());
        entity.setRecommendations(dto.getRecommendations());
        entity.setFilledBy(dto.getFilledBy());

        return entity;
    }

    private KTSurgeryDTO convertToDTO(KTSurgery entity) {
        KTSurgeryDTO dto = new KTSurgeryDTO();
        dto.setId(entity.getId());
        dto.setPatientPhn(entity.getPatientPhn());
        dto.setName(entity.getName());
        dto.setDob(formatDate(entity.getDob()));
        dto.setAge(entity.getAge());
        dto.setGender(entity.getGender());
        dto.setAddress(entity.getAddress());
        dto.setContact(entity.getContact());
        dto.setDiabetes(entity.getDiabetes());
        dto.setHypertension(entity.getHypertension());
        dto.setIhd(entity.getIhd());
        dto.setDyslipidaemia(entity.getDyslipidaemia());
        dto.setOther(entity.getOther());
        dto.setOtherSpecify(entity.getOtherSpecify());
        dto.setPrimaryDiagnosis(entity.getPrimaryDiagnosis());
        dto.setModeOfRRT(entity.getModeOfRRT());
        dto.setDurationRRT(entity.getDurationRRT());
        dto.setKtDate(formatDate(entity.getKtDate()));
        dto.setNumberOfKT(entity.getNumberOfKT());
        dto.setKtUnit(entity.getKtUnit());
        dto.setWardNumber(entity.getWardNumber());
        dto.setKtSurgeon(entity.getKtSurgeon());
        dto.setKtType(entity.getKtType());
        dto.setDonorRelationship(entity.getDonorRelationship());
        dto.setPeritonealPosition(entity.getPeritonealPosition());
        dto.setSideOfKT(entity.getSideOfKT());
        dto.setPreKT(entity.getPreKT());
        dto.setInductionTherapy(entity.getInductionTherapy());
        dto.setMaintenance(entity.getMaintenance());
        dto.setMaintenanceOther(entity.getMaintenanceOther());
        dto.setCotrimoxazole(entity.getCotrimoxazole());
        dto.setCotriDuration(entity.getCotriDuration());
        dto.setCotriStopped(formatDate(entity.getCotriStopped()));
        dto.setValganciclovir(entity.getValganciclovir());
        dto.setValganDuration(entity.getValganDuration());
        dto.setValganStopped(formatDate(entity.getValganStopped()));
        dto.setVaccination(entity.getVaccination());
        dto.setPreOpStatus(entity.getPreOpStatus());
        dto.setPreOpPreparation(entity.getPreOpPreparation());
        dto.setSurgicalNotes(entity.getSurgicalNotes());
        dto.setPreKTCreatinine(entity.getPreKTCreatinine());
        dto.setPostKTCreatinine(entity.getPostKTCreatinine());
        dto.setDelayedGraft(entity.getDelayedGraft());
        dto.setPostKTDialysis(entity.getPostKTDialysis());
        dto.setAcuteRejection(entity.getAcuteRejection());
        dto.setAcuteRejectionDetails(entity.getAcuteRejectionDetails());
        dto.setOtherComplications(entity.getOtherComplications());
        dto.setPostKTComp1(entity.getPostKTComp1());
        dto.setPostKTComp2(entity.getPostKTComp2());
        dto.setPostKTComp3(entity.getPostKTComp3());
        dto.setPostKTComp4(entity.getPostKTComp4());
        dto.setPostKTComp5(entity.getPostKTComp5());
        dto.setPostKTComp6(entity.getPostKTComp6());
        dto.setCurrentMeds(entity.getCurrentMeds());
        dto.setRecommendations(entity.getRecommendations());
        dto.setFilledBy(entity.getFilledBy());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, dateFormatter);
        } catch (Exception e) {
            return null;
        }
    }

    private String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(dateFormatter);
    }
}
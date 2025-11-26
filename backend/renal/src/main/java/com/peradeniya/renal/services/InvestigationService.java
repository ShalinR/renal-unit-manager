package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.InvestigationDTO;
import com.peradeniya.renal.model.Investigation;
import com.peradeniya.renal.model.Patient;
import com.peradeniya.renal.repository.InvestigationRepository;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InvestigationService {

    @Autowired
    private InvestigationRepository repository;

    @Autowired
    private PatientRepository patientRepository;

    public InvestigationDTO create(String patientPhn, InvestigationDTO dto) {
        Optional<Patient> patientOpt = patientRepository.findByPhn(patientPhn);
        if (patientOpt.isEmpty()) {
            throw new RuntimeException("Patient not found: " + patientPhn);
        }

        Patient patient = patientOpt.get();

        Investigation entity = Investigation.builder()
                .patient(patient)
                .date(dto.getDate())
                .type(dto.getType())
                .tacrolimus(dto.getTacrolimus())
                .creatinine(dto.getCreatinine())
                .eGFR(dto.getEGFR())
                .seNa(dto.getSeNa())
                .seK(dto.getSeK())
                .seHb(dto.getSeHb())
                .sAlbumin(dto.getSAlbumin())
                .urinePCR(dto.getUrinePCR())
                .pcv(dto.getPcv())
                .wbcTotal(dto.getWbcTotal())
                .wbcN(dto.getWbcN())
                .wbcL(dto.getWbcL())
                .platelet(dto.getPlatelet())
                .urineProtein(dto.getUrineProtein())
                .urinePusCells(dto.getUrinePusCells())
                .urineRBC(dto.getUrineRBC())
                .sCalcium(dto.getSCalcium())
                .sPhosphate(dto.getSPhosphate())
                .fbs(dto.getFbs())
                .ppbs(dto.getPpbs())
                .hba1c(dto.getHba1c())
                .cholesterolTotal(dto.getCholesterolTotal())
                .triglycerides(dto.getTriglycerides())
                .hdl(dto.getHdl())
                .ldl(dto.getLdl())
                .alp(dto.getAlp())
                .uricAcid(dto.getUricAcid())
                .alt(dto.getAlt())
                .ast(dto.getAst())
                .sBilirubin(dto.getSBilirubin())
                .annualScreening(dto.getAnnualScreening())
                .cmvPCR(dto.getCmvPCR())
                .bkvPCR(dto.getBkvPCR())
                .ebvPCR(dto.getEbvPCR())
                .hepBsAg(dto.getHepBsAg())
                .hepCAb(dto.getHepCAb())
                .hivAb(dto.getHivAb())
                .urineCytology(dto.getUrineCytology())
                .pth(dto.getPth())
                .vitD(dto.getVitD())
                .imagingUS_KUB_Pelvis_RenalDoppler(dto.getImagingUS_KUB_Pelvis_RenalDoppler())
                .imagingCXR(dto.getImagingCXR())
                .imagingECG(dto.getImagingECG())
                .imaging2DEcho(dto.getImaging2DEcho())
                .hematologyBloodPicture(dto.getHematologyBloodPicture())
                .breastScreen(dto.getBreastScreen())
                .psa(dto.getPsa())
                .papSmear(dto.getPapSmear())
                .stoolOccultBlood(dto.getStoolOccultBlood())
                .proceduresEndoscopy(dto.getProceduresEndoscopy())
                .specialistDental(dto.getSpecialistDental())
                .specialistOphthalmology(dto.getSpecialistOphthalmology())
                .additionalNotes(dto.getAdditionalNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Investigation saved = repository.save(entity);
        return convertToDTO(saved);
    }

    public List<InvestigationDTO> getByPatientPhn(String patientPhn) {
        return repository.findByPatientPhn(patientPhn)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InvestigationDTO> getByPatientPhnAndType(String patientPhn, String type) {
        return repository.findByPatientPhnAndType(patientPhn, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InvestigationDTO> getByPatientPhnAndDate(String patientPhn, String date) {
        return repository.findByPatientPhnAndDate(patientPhn, date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<InvestigationDTO> getById(Long id) {
        return repository.findById(id).map(this::convertToDTO);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private InvestigationDTO convertToDTO(Investigation entity) {
        InvestigationDTO dto = new InvestigationDTO();
        dto.setId(entity.getId());
        dto.setPatientPhn(entity.getPatient() != null ? entity.getPatient().getPhn() : null);
        dto.setDate(entity.getDate());
        dto.setType(entity.getType());

        // Map all fields
        dto.setTacrolimus(entity.getTacrolimus());
        dto.setCreatinine(entity.getCreatinine());
        dto.setEGFR(entity.getEGFR());
        dto.setSeNa(entity.getSeNa());
        dto.setSeK(entity.getSeK());
        dto.setSeHb(entity.getSeHb());
        dto.setSAlbumin(entity.getSAlbumin());
        dto.setUrinePCR(entity.getUrinePCR());
        dto.setPcv(entity.getPcv());
        dto.setWbcTotal(entity.getWbcTotal());
        dto.setWbcN(entity.getWbcN());
        dto.setWbcL(entity.getWbcL());
        dto.setPlatelet(entity.getPlatelet());
        dto.setUrineProtein(entity.getUrineProtein());
        dto.setUrinePusCells(entity.getUrinePusCells());
        dto.setUrineRBC(entity.getUrineRBC());
        dto.setSCalcium(entity.getSCalcium());
        dto.setSPhosphate(entity.getSPhosphate());
        dto.setFbs(entity.getFbs());
        dto.setPpbs(entity.getPpbs());
        dto.setHba1c(entity.getHba1c());
        dto.setCholesterolTotal(entity.getCholesterolTotal());
        dto.setTriglycerides(entity.getTriglycerides());
        dto.setHdl(entity.getHdl());
        dto.setLdl(entity.getLdl());
        dto.setAlp(entity.getAlp());
        dto.setUricAcid(entity.getUricAcid());
        dto.setAlt(entity.getAlt());
        dto.setAst(entity.getAst());
        dto.setSBilirubin(entity.getSBilirubin());
        dto.setAnnualScreening(entity.getAnnualScreening());
        dto.setCmvPCR(entity.getCmvPCR());
        dto.setBkvPCR(entity.getBkvPCR());
        dto.setEbvPCR(entity.getEbvPCR());
        dto.setHepBsAg(entity.getHepBsAg());
        dto.setHepCAb(entity.getHepCAb());
        dto.setHivAb(entity.getHivAb());
        dto.setUrineCytology(entity.getUrineCytology());
        dto.setPth(entity.getPth());
        dto.setVitD(entity.getVitD());
        dto.setImagingUS_KUB_Pelvis_RenalDoppler(entity.getImagingUS_KUB_Pelvis_RenalDoppler());
        dto.setImagingCXR(entity.getImagingCXR());
        dto.setImagingECG(entity.getImagingECG());
        dto.setImaging2DEcho(entity.getImaging2DEcho());
        dto.setHematologyBloodPicture(entity.getHematologyBloodPicture());
        dto.setBreastScreen(entity.getBreastScreen());
        dto.setPsa(entity.getPsa());
        dto.setPapSmear(entity.getPapSmear());
        dto.setStoolOccultBlood(entity.getStoolOccultBlood());
        dto.setProceduresEndoscopy(entity.getProceduresEndoscopy());
        dto.setSpecialistDental(entity.getSpecialistDental());
        dto.setSpecialistOphthalmology(entity.getSpecialistOphthalmology());
        dto.setAdditionalNotes(entity.getAdditionalNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}
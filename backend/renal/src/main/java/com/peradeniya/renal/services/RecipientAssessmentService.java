package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.*;
import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.RecipientAssessmentRepository;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipientAssessmentService {

    private final RecipientAssessmentRepository repository;
    private final PatientRepository patientRepository;

    public RecipientAssessmentService(RecipientAssessmentRepository repository, PatientRepository patientRepository) {
        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public RecipientAssessmentResponseDTO save(RecipientAssessmentDTO request) {
        Patient patient = patientRepository.findByPhn(request.getPhn())
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + request.getPhn()));

        RecipientAssessment entity;

        if (request.getId() != null) {
            // UPDATE existing assessment
            entity = repository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + request.getId()));
            updateEntityFromDTO(entity, request);
        } else {
            // CREATE new assessment
            entity = convertToEntity(request);
            entity.setPatient(patient);
        }

        RecipientAssessment savedEntity = repository.save(entity);
        return convertToResponseDTO(savedEntity);
    }


    public List<RecipientAssessmentResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public RecipientAssessmentResponseDTO getById(Long id) {
        RecipientAssessment entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipient assessment not found with id: " + id));
        return convertToResponseDTO(entity);
    }

    @Transactional
    public void assignDonorToRecipient(String recipientPhn, String donorId) {
        // Get the latest recipient assessment for this patient
        List<RecipientAssessment> assessments = repository.findByPatientPhnOrderByIdDesc(recipientPhn);
        if (assessments.isEmpty()) {
            throw new RuntimeException("No recipient assessment found for PHN: " + recipientPhn);
        }

        RecipientAssessment latestAssessment = assessments.get(0);
        latestAssessment.setDonorId(donorId);

        repository.save(latestAssessment);
    }




    public List<RecipientAssessmentResponseDTO> getByPatientPhn(String phn) {
        return repository.findByPatientPhn(phn).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    private void updateEntityFromDTO(RecipientAssessment entity, RecipientAssessmentDTO dto) {
        // Update basic patient info
        entity.setName(dto.getName());
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setOccupation(dto.getOccupation());
        entity.setAddress(dto.getAddress());
        entity.setNicNo(dto.getNicNo());
        entity.setContactDetails(dto.getContactDetails());
        entity.setEmailAddress(dto.getEmailAddress());

        // Update assessment specific fields
        entity.setDonorId(dto.getDonorId());
        entity.setRelationType(dto.getRelationType());
        entity.setRelationToRecipient(dto.getRelationToRecipient());

        // Update comorbidities
        if (dto.getComorbidities() != null) {
            if (entity.getComorbidities() == null) {
                entity.setComorbidities(new Comorbidities());
            }
            updateComorbiditiesFromDTO(entity.getComorbidities(), dto.getComorbidities());
        }


        // Update RRT Details
        if (dto.getRrtDetails() != null) {
            if (entity.getRrtDetails() == null) {
                entity.setRrtDetails(new RRTDetails());
            }
            updateRRTDetailsFromDTO(entity.getRrtDetails(), dto.getRrtDetails());
        }
        if (dto.getTransfusionHistory() != null) {
            List<TransfusionHistory> transfusionHistory = dto.getTransfusionHistory().stream()
                    .map(this::convertTransfusionHistoryToEntity)
                    .collect(Collectors.toList());
            entity.setTransfusionHistory(transfusionHistory);
        } else {
            entity.setTransfusionHistory(new ArrayList<>());
        }

        // Update other embedded objects
        entity.setSystemicInquiry(convertSystemicInquiryToEntity(dto.getSystemicInquiry()));
        entity.setComplains(dto.getComplains());
        entity.setDrugHistory(dto.getDrugHistory());
        entity.setAllergyHistory(convertAllergyHistoryToEntity(dto.getAllergyHistory()));
        entity.setFamilyHistory(convertFamilyHistoryToEntity(dto.getFamilyHistory()));
        entity.setSubstanceUse(convertSubstanceUseToEntity(dto.getSubstanceUse()));
        entity.setSocialHistory(convertSocialHistoryToEntity(dto.getSocialHistory()));
        entity.setExamination(convertExaminationToEntity(dto.getExamination()));
        entity.setImmunologicalDetails(convertImmunologicalDetailsToEntity(dto.getImmunologicalDetails()));
        entity.setCompletedBy(convertCompletedByToEntity(dto.getCompletedBy()));
        entity.setReviewedBy(convertReviewedByToEntity(dto.getReviewedBy()));
    }



    // Helper methods for updating embedded objects
    private void updateComorbiditiesFromDTO(Comorbidities entity, ComorbiditiesDTO dto) {
        if (dto.getDm() != null) entity.setDm(dto.getDm());
        entity.setDuration(dto.getDuration());
        if (dto.getPsychiatricIllness() != null) entity.setPsychiatricIllness(dto.getPsychiatricIllness());
        if (dto.getHtn() != null) entity.setHtn(dto.getHtn());
        if (dto.getIhd() != null) entity.setIhd(dto.getIhd());
        if (dto.getRetinopathy() != null) entity.setRetinopathy(dto.getRetinopathy());
        if (dto.getNephropathy() != null) entity.setNephropathy(dto.getNephropathy());
        if (dto.getNeuropathy() != null) entity.setNeuropathy(dto.getNeuropathy());
        entity.setTwoDEcho(dto.getTwoDEcho());
        entity.setCoronaryAngiogram(dto.getCoronaryAngiogram());
        if (dto.getCva() != null) entity.setCva(dto.getCva());
        if (dto.getPvd() != null) entity.setPvd(dto.getPvd());
        if (dto.getDl() != null) entity.setDl(dto.getDl());
        if (dto.getClcd() != null) entity.setClcd(dto.getClcd());
        entity.setChildClass(dto.getChildClass());
        entity.setMeldScore(dto.getMeldScore());
        if (dto.getHf() != null) entity.setHf(dto.getHf());
    }

    private void updateRRTDetailsFromDTO(RRTDetails entity, RRTDetailsDTO dto) {
        if (dto.getModalityHD() != null) entity.setModalityHD(dto.getModalityHD());
        if (dto.getModalityCAPD() != null) entity.setModalityCAPD(dto.getModalityCAPD());
        entity.setStartingDate(dto.getStartingDate());
        if (dto.getAccessFemoral() != null) entity.setAccessFemoral(dto.getAccessFemoral());
        if (dto.getAccessIJC() != null) entity.setAccessIJC(dto.getAccessIJC());
        if (dto.getAccessPermeath() != null) entity.setAccessPermeath(dto.getAccessPermeath());
        if (dto.getAccessCAPD() != null) entity.setAccessCAPD(dto.getAccessCAPD());
        entity.setComplications(dto.getComplications());
    }
    private RecipientAssessment convertToEntity(RecipientAssessmentDTO dto) {
        RecipientAssessment entity = new RecipientAssessment();

        // Copy basic patient info
        entity.setName(dto.getName());
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setOccupation(dto.getOccupation());
        entity.setAddress(dto.getAddress());
        entity.setNicNo(dto.getNicNo());
        entity.setContactDetails(dto.getContactDetails());
        entity.setEmailAddress(dto.getEmailAddress());

        // Copy assessment specific fields
        entity.setDonorId(dto.getDonorId());
        entity.setRelationType(dto.getRelationType());
        entity.setRelationToRecipient(dto.getRelationToRecipient());

        // Copy comorbidities - UPDATED STRUCTURE
        if (dto.getComorbidities() != null) {
            Comorbidities comorbidities = convertComorbiditiesToEntity(dto.getComorbidities());
            entity.setComorbidities(comorbidities);
        }

        // Copy RRT Details - NEW STRUCTURE
        if (dto.getRrtDetails() != null) {
            RRTDetails rrtDetails = convertRRTDetailsToEntity(dto.getRrtDetails());
            entity.setRrtDetails(rrtDetails);
        }
        if (dto.getTransfusionHistory() != null) {
            List<TransfusionHistory> transfusionHistory = dto.getTransfusionHistory().stream()
                    .map(this::convertTransfusionHistoryToEntity)
                    .collect(Collectors.toList());
            entity.setTransfusionHistory(transfusionHistory);
        }
        // Copy other embedded objects
        entity.setSystemicInquiry(convertSystemicInquiryToEntity(dto.getSystemicInquiry()));
        entity.setComplains(dto.getComplains());
        entity.setDrugHistory(dto.getDrugHistory());
        entity.setAllergyHistory(convertAllergyHistoryToEntity(dto.getAllergyHistory()));
        entity.setFamilyHistory(convertFamilyHistoryToEntity(dto.getFamilyHistory()));
        entity.setSubstanceUse(convertSubstanceUseToEntity(dto.getSubstanceUse()));
        entity.setSocialHistory(convertSocialHistoryToEntity(dto.getSocialHistory()));
        entity.setExamination(convertExaminationToEntity(dto.getExamination()));
        entity.setImmunologicalDetails(convertImmunologicalDetailsToEntity(dto.getImmunologicalDetails()));
        entity.setCompletedBy(convertCompletedByToEntity(dto.getCompletedBy()));
        entity.setReviewedBy(convertReviewedByToEntity(dto.getReviewedBy()));
        return entity;
    }

    private RecipientAssessmentResponseDTO convertToResponseDTO(RecipientAssessment entity) {
        RecipientAssessmentResponseDTO dto = new RecipientAssessmentResponseDTO();

        dto.setId(entity.getId());

        // Copy basic patient info
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setGender(entity.getGender());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setOccupation(entity.getOccupation());
        dto.setAddress(entity.getAddress());
        dto.setNicNo(entity.getNicNo());
        dto.setContactDetails(entity.getContactDetails());
        dto.setEmailAddress(entity.getEmailAddress());

        // Copy assessment specific fields
        dto.setDonorId(entity.getDonorId());
        dto.setRelationType(entity.getRelationType());
        dto.setRelationToRecipient(entity.getRelationToRecipient());

        // Copy comorbidities - UPDATED STRUCTURE
        if (entity.getComorbidities() != null) {
            ComorbiditiesDTO comorbiditiesDTO = convertComorbiditiesToDTO(entity.getComorbidities());
            dto.setComorbidities(comorbiditiesDTO);
        }

        // Copy RRT Details - NEW STRUCTURE
        if (entity.getRrtDetails() != null) {
            RRTDetailsDTO rrtDetailsDTO = convertRRTDetailsToDTO(entity.getRrtDetails());
            dto.setRrtDetails(rrtDetailsDTO);
        }
        if (entity.getTransfusionHistory() != null) {
            List<TransfusionHistoryDTO> transfusionHistory = entity.getTransfusionHistory().stream()
                    .map(this::convertTransfusionHistoryToDTO)
                    .collect(Collectors.toList());
            dto.setTransfusionHistory(transfusionHistory);
        }
        // Copy other embedded objects as DTOs
        dto.setSystemicInquiry(convertSystemicInquiryToDTO(entity.getSystemicInquiry()));
        dto.setComplains(entity.getComplains());
        dto.setDrugHistory(entity.getDrugHistory());
        dto.setAllergyHistory(convertAllergyHistoryToDTO(entity.getAllergyHistory()));
        dto.setFamilyHistory(convertFamilyHistoryToDTO(entity.getFamilyHistory()));
        dto.setSubstanceUse(convertSubstanceUseToDTO(entity.getSubstanceUse()));
        dto.setSocialHistory(convertSocialHistoryToDTO(entity.getSocialHistory()));
        dto.setExamination(convertExaminationToDTO(entity.getExamination()));
        dto.setImmunologicalDetails(convertImmunologicalDetailsToDTO(entity.getImmunologicalDetails()));
        dto.setCompletedBy(convertCompletedByToDTO(entity.getCompletedBy()));
        dto.setReviewedBy(convertReviewedByToDTO(entity.getReviewedBy()));
        // Include patient PHN without circular reference
        if (entity.getPatient() != null) {
            dto.setPatientPhn(entity.getPatient().getPhn());
        }

        return dto;
    }
    // In RecipientAssessmentService
    public RecipientAssessmentResponseDTO getLatestByPatientPhn(String phn) {
        // Option 1: Use the repository method that returns List (your current approach)
        List<RecipientAssessment> assessments = repository.findByPatientPhnOrderByIdDesc(phn);
        if (assessments.isEmpty()) {
            return null; // No existing assessment
        }
        return convertToResponseDTO(assessments.get(0)); // Return the first one (latest due to ordering)

        // Option 2: Use the new method that returns Optional (cleaner)
        // Optional<RecipientAssessment> assessment = repository.findTopByPatientPhnOrderByIdDesc(phn);
        // return assessment.map(this::convertToResponseDTO).orElse(null);
    }
    // ============ NEW CONVERSION METHODS FOR COMORBIDITIES AND RRT DETAILS ============

    private Comorbidities convertComorbiditiesToEntity(ComorbiditiesDTO dto) {
        if (dto == null) return null;

        Comorbidities entity = new Comorbidities();
        entity.setDm(dto.getDm() != null ? dto.getDm() : false);
        entity.setDuration(dto.getDuration());
        entity.setPsychiatricIllness(dto.getPsychiatricIllness() != null ? dto.getPsychiatricIllness() : false);
        entity.setHtn(dto.getHtn() != null ? dto.getHtn() : false);
        entity.setIhd(dto.getIhd() != null ? dto.getIhd() : false);
        entity.setRetinopathy(dto.getRetinopathy() != null ? dto.getRetinopathy() : false);
        entity.setNephropathy(dto.getNephropathy() != null ? dto.getNephropathy() : false);
        entity.setNeuropathy(dto.getNeuropathy() != null ? dto.getNeuropathy() : false);
        entity.setTwoDEcho(dto.getTwoDEcho());
        entity.setCoronaryAngiogram(dto.getCoronaryAngiogram());
        entity.setCva(dto.getCva() != null ? dto.getCva() : false);
        entity.setPvd(dto.getPvd() != null ? dto.getPvd() : false);
        entity.setDl(dto.getDl() != null ? dto.getDl() : false);
        entity.setClcd(dto.getClcd() != null ? dto.getClcd() : false);
        entity.setChildClass(dto.getChildClass());
        entity.setMeldScore(dto.getMeldScore());
        entity.setHf(dto.getHf() != null ? dto.getHf() : false);

        return entity;
    }

    private ComorbiditiesDTO convertComorbiditiesToDTO(Comorbidities entity) {
        if (entity == null) return null;

        ComorbiditiesDTO dto = new ComorbiditiesDTO();
        dto.setDm(entity.isDm());
        dto.setDuration(entity.getDuration());
        dto.setPsychiatricIllness(entity.isPsychiatricIllness());
        dto.setHtn(entity.isHtn());
        dto.setIhd(entity.isIhd());
        dto.setRetinopathy(entity.isRetinopathy());
        dto.setNephropathy(entity.isNephropathy());
        dto.setNeuropathy(entity.isNeuropathy());
        dto.setTwoDEcho(entity.getTwoDEcho());
        dto.setCoronaryAngiogram(entity.getCoronaryAngiogram());
        dto.setCva(entity.isCva());
        dto.setPvd(entity.isPvd());
        dto.setDl(entity.isDl());
        dto.setClcd(entity.isClcd());
        dto.setChildClass(entity.getChildClass());
        dto.setMeldScore(entity.getMeldScore());
        dto.setHf(entity.isHf());

        return dto;
    }
    private TransfusionHistory convertTransfusionHistoryToEntity(TransfusionHistoryDTO dto) {
        if (dto == null) return null;
        return new TransfusionHistory(dto.getDate(), dto.getIndication(), dto.getVolume());
    }

    private TransfusionHistoryDTO convertTransfusionHistoryToDTO(TransfusionHistory entity) {
        if (entity == null) return null;
        return new TransfusionHistoryDTO(entity.getDate(), entity.getIndication(), entity.getVolume());
    }
    private RRTDetails convertRRTDetailsToEntity(RRTDetailsDTO dto) {
        if (dto == null) return null;

        RRTDetails entity = new RRTDetails();
        entity.setModalityHD(dto.getModalityHD() != null ? dto.getModalityHD() : false);
        entity.setModalityCAPD(dto.getModalityCAPD() != null ? dto.getModalityCAPD() : false);
        entity.setStartingDate(dto.getStartingDate());
        entity.setAccessFemoral(dto.getAccessFemoral() != null ? dto.getAccessFemoral() : false);
        entity.setAccessIJC(dto.getAccessIJC() != null ? dto.getAccessIJC() : false);
        entity.setAccessPermeath(dto.getAccessPermeath() != null ? dto.getAccessPermeath() : false);
        entity.setAccessCAPD(dto.getAccessCAPD() != null ? dto.getAccessCAPD() : false);
        entity.setComplications(dto.getComplications());

        return entity;
    }

    private RRTDetailsDTO convertRRTDetailsToDTO(RRTDetails entity) {
        if (entity == null) return null;

        RRTDetailsDTO dto = new RRTDetailsDTO();
        dto.setModalityHD(entity.isModalityHD());
        dto.setModalityCAPD(entity.isModalityCAPD());
        dto.setStartingDate(entity.getStartingDate());
        dto.setAccessFemoral(entity.isAccessFemoral());
        dto.setAccessIJC(entity.isAccessIJC());
        dto.setAccessPermeath(entity.isAccessPermeath());
        dto.setAccessCAPD(entity.isAccessCAPD());
        dto.setComplications(entity.getComplications());

        return dto;
    }

    // Add these conversion methods to the service class

    private CompletedBy convertCompletedByToEntity(CompletedByDTO dto) {
        if (dto == null) return null;

        CompletedBy entity = new CompletedBy();
        entity.setStaffName(dto.getStaffName());
        entity.setStaffRole(dto.getStaffRole());
        entity.setStaffId(dto.getStaffId());
        entity.setDepartment(dto.getDepartment());
        entity.setSignature(dto.getSignature());
        entity.setCompletionDate(dto.getCompletionDate());
        return entity;
    }

    private CompletedByDTO convertCompletedByToDTO(CompletedBy entity) {
        if (entity == null) return null;

        CompletedByDTO dto = new CompletedByDTO();
        dto.setStaffName(entity.getStaffName());
        dto.setStaffRole(entity.getStaffRole());
        dto.setStaffId(entity.getStaffId());
        dto.setDepartment(entity.getDepartment());
        dto.setSignature(entity.getSignature());
        dto.setCompletionDate(entity.getCompletionDate());
        return dto;
    }

    private ReviewedBy convertReviewedByToEntity(ReviewedByDTO dto) {
        if (dto == null) return null;

        ReviewedBy entity = new ReviewedBy();
        entity.setConsultantName(dto.getConsultantName());
        entity.setConsultantId(dto.getConsultantId());
        entity.setReviewDate(dto.getReviewDate());
        entity.setApprovalStatus(dto.getApprovalStatus());
        entity.setNotes(dto.getNotes());
        return entity;
    }

    private ReviewedByDTO convertReviewedByToDTO(ReviewedBy entity) {
        if (entity == null) return null;

        ReviewedByDTO dto = new ReviewedByDTO();
        dto.setConsultantName(entity.getConsultantName());
        dto.setConsultantId(entity.getConsultantId());
        dto.setReviewDate(entity.getReviewDate());
        dto.setApprovalStatus(entity.getApprovalStatus());
        dto.setNotes(entity.getNotes());
        return dto;
    }
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Recipient assessment not found with id: " + id);
        }
        repository.deleteById(id);
    }
    // ============ EXISTING CONVERSION METHODS FOR EMBEDDED OBJECTS ============

    private SystemicInquiry convertSystemicInquiryToEntity(SystemicInquiryDTO dto) {
        if (dto == null) return null;

        SystemicInquiry entity = new SystemicInquiry();

        // Convert Constitutional
        if (dto.getConstitutional() != null) {
            SystemicInquiry.Constitutional constitutional = new SystemicInquiry.Constitutional();
            constitutional.setLoa(dto.getConstitutional().getLoa() != null ? dto.getConstitutional().getLoa() : false);
            constitutional.setLow(dto.getConstitutional().getLow() != null ? dto.getConstitutional().getLow() : false);
            entity.setConstitutional(constitutional);
        }

        // Convert CVS
        if (dto.getCvs() != null) {
            SystemicInquiry.CVS cvs = new SystemicInquiry.CVS();
            cvs.setChestPain(dto.getCvs().getChestPain() != null ? dto.getCvs().getChestPain() : false);
            cvs.setOdema(dto.getCvs().getOdema() != null ? dto.getCvs().getOdema() : false);
            cvs.setSob(dto.getCvs().getSob() != null ? dto.getCvs().getSob() : false);
            entity.setCvs(cvs);
        }

        // Convert Respiratory
        if (dto.getRespiratory() != null) {
            SystemicInquiry.Resp respiratory = new SystemicInquiry.Resp();
            respiratory.setCough(dto.getRespiratory().getCough() != null ? dto.getRespiratory().getCough() : false);
            respiratory.setHemoptysis(dto.getRespiratory().getHemoptysis() != null ? dto.getRespiratory().getHemoptysis() : false);
            respiratory.setWheezing(dto.getRespiratory().getWheezing() != null ? dto.getRespiratory().getWheezing() : false);
            entity.setRespiratory(respiratory);
        }

        // Convert GIT
        if (dto.getGit() != null) {
            SystemicInquiry.GIT git = new SystemicInquiry.GIT();
            git.setConstipation(dto.getGit().getConstipation() != null ? dto.getGit().getConstipation() : false);
            git.setDiarrhea(dto.getGit().getDiarrhea() != null ? dto.getGit().getDiarrhea() : false);
            git.setMelena(dto.getGit().getMelena() != null ? dto.getGit().getMelena() : false);
            git.setPrBleeding(dto.getGit().getPrBleeding() != null ? dto.getGit().getPrBleeding() : false);
            entity.setGit(git);
        }

        // Convert Renal
        if (dto.getRenal() != null) {
            SystemicInquiry.Renal renal = new SystemicInquiry.Renal();
            renal.setHematuria(dto.getRenal().getHematuria() != null ? dto.getRenal().getHematuria() : false);
            renal.setFrothyUrine(dto.getRenal().getFrothyUrine() != null ? dto.getRenal().getFrothyUrine() : false);
            entity.setRenal(renal);
        }

        // Convert Neuro
        if (dto.getNeuro() != null) {
            SystemicInquiry.Neuro neuro = new SystemicInquiry.Neuro();
            neuro.setSeizures(dto.getNeuro().getSeizures() != null ? dto.getNeuro().getSeizures() : false);
            neuro.setVisualDisturbance(dto.getNeuro().getVisualDisturbance() != null ? dto.getNeuro().getVisualDisturbance() : false);
            neuro.setHeadache(dto.getNeuro().getHeadache() != null ? dto.getNeuro().getHeadache() : false);
            neuro.setLimbWeakness(dto.getNeuro().getLimbWeakness() != null ? dto.getNeuro().getLimbWeakness() : false);
            entity.setNeuro(neuro);
        }

        // Convert Gynecology
        if (dto.getGynecology() != null) {
            SystemicInquiry.Gynecology gynecology = new SystemicInquiry.Gynecology();
            gynecology.setPvBleeding(dto.getGynecology().getPvBleeding() != null ? dto.getGynecology().getPvBleeding() : false);
            gynecology.setMenopause(dto.getGynecology().getMenopause() != null ? dto.getGynecology().getMenopause() : false);
            gynecology.setMenorrhagia(dto.getGynecology().getMenorrhagia() != null ? dto.getGynecology().getMenorrhagia() : false);
            gynecology.setLrmp(dto.getGynecology().getLrmp() != null ? dto.getGynecology().getLrmp() : false);
            entity.setGynecology(gynecology);
        }

        entity.setSexualHistory(dto.getSexualHistory());

        return entity;
    }

    private SystemicInquiryDTO convertSystemicInquiryToDTO(SystemicInquiry entity) {
        if (entity == null) return null;

        SystemicInquiryDTO dto = new SystemicInquiryDTO();

        // Convert Constitutional
        if (entity.getConstitutional() != null) {
            ConstitutionalDTO constitutional = new ConstitutionalDTO();
            constitutional.setLoa(entity.getConstitutional().isLoa());
            constitutional.setLow(entity.getConstitutional().isLow());
            dto.setConstitutional(constitutional);
        }

        // Convert CVS
        if (entity.getCvs() != null) {
            CvsDTO cvs = new CvsDTO();
            cvs.setChestPain(entity.getCvs().isChestPain());
            cvs.setOdema(entity.getCvs().isOdema());
            cvs.setSob(entity.getCvs().isSob());
            dto.setCvs(cvs);
        }

        // Convert Respiratory
        if (entity.getRespiratory() != null) {
            RespiratoryDTO respiratory = new RespiratoryDTO();
            respiratory.setCough(entity.getRespiratory().isCough());
            respiratory.setHemoptysis(entity.getRespiratory().isHemoptysis());
            respiratory.setWheezing(entity.getRespiratory().isWheezing());
            dto.setRespiratory(respiratory);
        }

        // Convert GIT
        if (entity.getGit() != null) {
            GitDTO git = new GitDTO();
            git.setConstipation(entity.getGit().isConstipation());
            git.setDiarrhea(entity.getGit().isDiarrhea());
            git.setMelena(entity.getGit().isMelena());
            git.setPrBleeding(entity.getGit().isPrBleeding());
            dto.setGit(git);
        }

        // Convert Renal
        if (entity.getRenal() != null) {
            RenalDTO renal = new RenalDTO();
            renal.setHematuria(entity.getRenal().isHematuria());
            renal.setFrothyUrine(entity.getRenal().isFrothyUrine());
            dto.setRenal(renal);
        }

        // Convert Neuro
        if (entity.getNeuro() != null) {
            NeuroDTO neuro = new NeuroDTO();
            neuro.setSeizures(entity.getNeuro().isSeizures());
            neuro.setVisualDisturbance(entity.getNeuro().isVisualDisturbance());
            neuro.setHeadache(entity.getNeuro().isHeadache());
            neuro.setLimbWeakness(entity.getNeuro().isLimbWeakness());
            dto.setNeuro(neuro);
        }

        // Convert Gynecology
        if (entity.getGynecology() != null) {
            GynecologyDTO gynecology = new GynecologyDTO();
            gynecology.setPvBleeding(entity.getGynecology().isPvBleeding());
            gynecology.setMenopause(entity.getGynecology().isMenopause());
            gynecology.setMenorrhagia(entity.getGynecology().isMenorrhagia());
            gynecology.setLrmp(entity.getGynecology().isLrmp());
            dto.setGynecology(gynecology);
        }

        dto.setSexualHistory(entity.getSexualHistory());

        return dto;
    }

    private Examination convertExaminationToEntity(ExaminationDTO dto) {
        if (dto == null) return null;

        Examination entity = new Examination();
        entity.setHeight(dto.getHeight());
        entity.setWeight(dto.getWeight());
        entity.setBmi(dto.getBmi());
        entity.setPallor(dto.getPallor() != null ? dto.getPallor() : false);
        entity.setIcterus(dto.getIcterus() != null ? dto.getIcterus() : false);
        entity.setClubbing(dto.getClubbing() != null ? dto.getClubbing() : false);
        entity.setAnkleOedema(dto.getAnkleOedema() != null ? dto.getAnkleOedema() : false);
        entity.setBrcostExamination(dto.getBrcostExamination());

        // Convert Oral
        if (dto.getOral() != null) {
            Examination.Oral oral = new Examination.Oral();
            oral.setDentalCaries(dto.getOral().getDentalCaries() != null ? dto.getOral().getDentalCaries() : false);
            oral.setOralHygiene(dto.getOral().getOralHygiene() != null ? dto.getOral().getOralHygiene() : false);
            oral.setSatisfactory(dto.getOral().getSatisfactory() != null ? dto.getOral().getSatisfactory() : false);
            oral.setUnsatisfactory(dto.getOral().getUnsatisfactory() != null ? dto.getOral().getUnsatisfactory() : false);
            entity.setOral(oral);
        }

        // Convert LymphNodes
        if (dto.getLymphNodes() != null) {
            Examination.LymphNodes lymphNodes = new Examination.LymphNodes();
            lymphNodes.setCervical(dto.getLymphNodes().getCervical() != null ? dto.getLymphNodes().getCervical() : false);
            lymphNodes.setAxillary(dto.getLymphNodes().getAxillary() != null ? dto.getLymphNodes().getAxillary() : false);
            lymphNodes.setInguinal(dto.getLymphNodes().getInguinal() != null ? dto.getLymphNodes().getInguinal() : false);
            entity.setLymphNodes(lymphNodes);
        }

        // Convert CVS Exam
        if (dto.getCvs() != null) {
            Examination.CVSExam cvsExam = new Examination.CVSExam();
            cvsExam.setBp(dto.getCvs().getBp());
            cvsExam.setPr(dto.getCvs().getPr());
            cvsExam.setMurmurs(dto.getCvs().getMurmurs() != null ? dto.getCvs().getMurmurs() : false);
            entity.setCvs(cvsExam);
        }

        // Convert Respiratory Exam
        if (dto.getRespiratory() != null) {
            Examination.RespExam respExam = new Examination.RespExam();
            respExam.setRr(dto.getRespiratory().getRr()!= null ? dto.getRespiratory().getRr() : false);
            respExam.setSpo2(dto.getRespiratory().getSpo2()!=null ? dto.getRespiratory().getSpo2() : false);
            respExam.setAuscultation(dto.getRespiratory().getAuscultation() != null ? dto.getRespiratory().getAuscultation() : false);
            respExam.setCrepts(dto.getRespiratory().getCrepts() != null ? dto.getRespiratory().getCrepts() : false);
            respExam.setRanchi(dto.getRespiratory().getRanchi() != null ? dto.getRespiratory().getRanchi() : false);
            respExam.setEffusion(dto.getRespiratory().getEffusion() != null ? dto.getRespiratory().getEffusion() : false);
            entity.setRespiratory(respExam);
        }

        // Convert Abdomen Exam
        if (dto.getAbdomen() != null) {
            Examination.AbdomenExam abdomenExam = new Examination.AbdomenExam();
            abdomenExam.setHepatomegaly(dto.getAbdomen().getHepatomegaly() != null ? dto.getAbdomen().getHepatomegaly() : false);
            abdomenExam.setSplenomegaly(dto.getAbdomen().getSplenomegaly() != null ? dto.getAbdomen().getSplenomegaly() : false);
            abdomenExam.setRenalMasses(dto.getAbdomen().getRenalMasses() != null ? dto.getAbdomen().getRenalMasses() : false);
            abdomenExam.setFreeFluid(dto.getAbdomen().getFreeFluid() != null ? dto.getAbdomen().getFreeFluid() : false);
            entity.setAbdomen(abdomenExam);
        }

        // Convert Neurological Exam
        if (dto.getNeurologicalExam() != null) {
            Examination.NeurologicalExam neuroExam = new Examination.NeurologicalExam();
            neuroExam.setCranialNerves(dto.getNeurologicalExam().getCranialNerves() != null ? dto.getNeurologicalExam().getCranialNerves() : false);
            neuroExam.setUpperLimb(dto.getNeurologicalExam().getUpperLimb() != null ? dto.getNeurologicalExam().getUpperLimb() : false);
            neuroExam.setLowerLimb(dto.getNeurologicalExam().getLowerLimb() != null ? dto.getNeurologicalExam().getLowerLimb() : false);
            neuroExam.setCoordination(dto.getNeurologicalExam().getCoordination() != null ? dto.getNeurologicalExam().getCoordination() : false);
            entity.setNeurologicalExam(neuroExam);
        }

        return entity;
    }

    private ExaminationDTO convertExaminationToDTO(Examination entity) {
        if (entity == null) return null;

        ExaminationDTO dto = new ExaminationDTO();
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setBmi(entity.getBmi());
        dto.setPallor(entity.isPallor());
        dto.setIcterus(entity.isIcterus());
        dto.setClubbing(entity.isClubbing());
        dto.setAnkleOedema(entity.isAnkleOedema());
        dto.setBrcostExamination(entity.getBrcostExamination());

        // Convert Oral
        if (entity.getOral() != null) {
            OralDTO oral = new OralDTO();
            oral.setDentalCaries(entity.getOral().isDentalCaries());
            oral.setOralHygiene(entity.getOral().isOralHygiene());
            oral.setSatisfactory(entity.getOral().isSatisfactory());
            oral.setUnsatisfactory(entity.getOral().isUnsatisfactory());
            dto.setOral(oral);
        }

        // Convert LymphNodes
        if (entity.getLymphNodes() != null) {
            LymphNodesDTO lymphNodes = new LymphNodesDTO();
            lymphNodes.setCervical(entity.getLymphNodes().isCervical());
            lymphNodes.setAxillary(entity.getLymphNodes().isAxillary());
            lymphNodes.setInguinal(entity.getLymphNodes().isInguinal());
            dto.setLymphNodes(lymphNodes);
        }

        // Convert CVS Exam
        if (entity.getCvs() != null) {
            CvsExamDTO cvsExam = new CvsExamDTO();
            cvsExam.setBp(entity.getCvs().getBp());
            cvsExam.setPr(entity.getCvs().getPr());
            cvsExam.setMurmurs(entity.getCvs().isMurmurs());
            dto.setCvs(cvsExam);
        }

        // Convert Respiratory Exam
        if (entity.getRespiratory() != null) {
            RespiratoryExamDTO respExam = new RespiratoryExamDTO();
            respExam.setRr(entity.getRespiratory().isRr());
            respExam.setSpo2(entity.getRespiratory().isSpo2());
            respExam.setAuscultation(entity.getRespiratory().isAuscultation());
            respExam.setCrepts(entity.getRespiratory().isCrepts());
            respExam.setRanchi(entity.getRespiratory().isRanchi());
            respExam.setEffusion(entity.getRespiratory().isEffusion());
            dto.setRespiratory(respExam);
        }

        // Convert Abdomen Exam
        if (entity.getAbdomen() != null) {
            AbdomenExamDTO abdomenExam = new AbdomenExamDTO();
            abdomenExam.setHepatomegaly(entity.getAbdomen().isHepatomegaly());
            abdomenExam.setSplenomegaly(entity.getAbdomen().isSplenomegaly());
            abdomenExam.setRenalMasses(entity.getAbdomen().isRenalMasses());
            abdomenExam.setFreeFluid(entity.getAbdomen().isFreeFluid());
            dto.setAbdomen(abdomenExam);
        }

        // Convert Neurological Exam
        if (entity.getNeurologicalExam() != null) {
            NeurologicalExamDTO neuroExam = new NeurologicalExamDTO();
            neuroExam.setCranialNerves(entity.getNeurologicalExam().isCranialNerves());
            neuroExam.setUpperLimb(entity.getNeurologicalExam().isUpperLimb());
            neuroExam.setLowerLimb(entity.getNeurologicalExam().isLowerLimb());
            neuroExam.setCoordination(entity.getNeurologicalExam().isCoordination());
            dto.setNeurologicalExam(neuroExam);
        }

        return dto;
    }

    private ImmunologicalDetails convertImmunologicalDetailsToEntity(ImmunologicalDetailsDTO dto) {
        if (dto == null) return null;

        ImmunologicalDetails entity = new ImmunologicalDetails();
        entity.setPraPre(dto.getPraPre());
        entity.setPraPost(dto.getPraPost());
        entity.setDsa(dto.getDsa());
        entity.setImmunologicalRisk(dto.getImmunologicalRisk());

        // Convert Blood Group
        if (dto.getBloodGroup() != null) {
            ImmunologicalDetails.BloodGroup bloodGroup = new ImmunologicalDetails.BloodGroup();
            bloodGroup.setD(dto.getBloodGroup().getD());
            bloodGroup.setR(dto.getBloodGroup().getR());
            entity.setBloodGroup(bloodGroup);
        }

        // Convert Cross Match
        if (dto.getCrossMatch() != null) {
            ImmunologicalDetails.CrossMatch crossMatch = new ImmunologicalDetails.CrossMatch();
            crossMatch.setTCell(dto.getCrossMatch().getTCell());
            crossMatch.setBCell(dto.getCrossMatch().getBCell());
            entity.setCrossMatch(crossMatch);
        }

        // Convert HLA Typing
        if (dto.getHlaTyping() != null) {
            ImmunologicalDetails.HLATyping hlaTyping = new ImmunologicalDetails.HLATyping();

            // Convert Donor
            if (dto.getHlaTyping().getDonor() != null) {
                ImmunologicalDetails.HLATyping.HLADetails donor = new ImmunologicalDetails.HLATyping.HLADetails();
                donor.setHlaA(dto.getHlaTyping().getDonor().getHlaA());
                donor.setHlaB(dto.getHlaTyping().getDonor().getHlaB());
                donor.setHlaC(dto.getHlaTyping().getDonor().getHlaC());
                donor.setHlaDR(dto.getHlaTyping().getDonor().getHlaDR());
                donor.setHlaDP(dto.getHlaTyping().getDonor().getHlaDP());
                donor.setHlaDQ(dto.getHlaTyping().getDonor().getHlaDQ());
                hlaTyping.setDonor(donor);
            }

            // Convert Recipient
            if (dto.getHlaTyping().getRecipient() != null) {
                ImmunologicalDetails.HLATyping.HLADetails recipient = new ImmunologicalDetails.HLATyping.HLADetails();
                recipient.setHlaA(dto.getHlaTyping().getRecipient().getHlaA());
                recipient.setHlaB(dto.getHlaTyping().getRecipient().getHlaB());
                recipient.setHlaC(dto.getHlaTyping().getRecipient().getHlaC());
                recipient.setHlaDR(dto.getHlaTyping().getRecipient().getHlaDR());
                recipient.setHlaDP(dto.getHlaTyping().getRecipient().getHlaDP());
                recipient.setHlaDQ(dto.getHlaTyping().getRecipient().getHlaDQ());
                hlaTyping.setRecipient(recipient);
            }

            // Convert Conclusion
            if (dto.getHlaTyping().getConclusion() != null) {
                ImmunologicalDetails.HLATyping.HLADetails conclusion = new ImmunologicalDetails.HLATyping.HLADetails();
                conclusion.setHlaA(dto.getHlaTyping().getConclusion().getHlaA());
                conclusion.setHlaB(dto.getHlaTyping().getConclusion().getHlaB());
                conclusion.setHlaC(dto.getHlaTyping().getConclusion().getHlaC());
                conclusion.setHlaDR(dto.getHlaTyping().getConclusion().getHlaDR());
                conclusion.setHlaDP(dto.getHlaTyping().getConclusion().getHlaDP());
                conclusion.setHlaDQ(dto.getHlaTyping().getConclusion().getHlaDQ());
                hlaTyping.setConclusion(conclusion);
            }

            entity.setHlaTyping(hlaTyping);
        }

        return entity;
    }

    private ImmunologicalDetailsDTO convertImmunologicalDetailsToDTO(ImmunologicalDetails entity) {
        if (entity == null) return null;

        ImmunologicalDetailsDTO dto = new ImmunologicalDetailsDTO();
        dto.setPraPre(entity.getPraPre());
        dto.setPraPost(entity.getPraPost());
        dto.setDsa(entity.getDsa());
        dto.setImmunologicalRisk(entity.getImmunologicalRisk());

        // Convert Blood Group
        if (entity.getBloodGroup() != null) {
            BloodGroupDTO bloodGroup = new BloodGroupDTO();
            bloodGroup.setD(entity.getBloodGroup().getD());
            bloodGroup.setR(entity.getBloodGroup().getR());
            dto.setBloodGroup(bloodGroup);
        }

        // Convert Cross Match
        if (entity.getCrossMatch() != null) {
            CrossMatchDTO crossMatch = new CrossMatchDTO();
            crossMatch.setTCell(entity.getCrossMatch().getTCell());
            crossMatch.setBCell(entity.getCrossMatch().getBCell());
            dto.setCrossMatch(crossMatch);
        }

        // Convert HLA Typing
        if (entity.getHlaTyping() != null) {
            HlaTypingDTO hlaTyping = new HlaTypingDTO();

            // Convert Donor
            if (entity.getHlaTyping().getDonor() != null) {
                HlaDetailsDTO donor = new HlaDetailsDTO();
                donor.setHlaA(entity.getHlaTyping().getDonor().getHlaA());
                donor.setHlaB(entity.getHlaTyping().getDonor().getHlaB());
                donor.setHlaC(entity.getHlaTyping().getDonor().getHlaC());
                donor.setHlaDR(entity.getHlaTyping().getDonor().getHlaDR());
                donor.setHlaDP(entity.getHlaTyping().getDonor().getHlaDP());
                donor.setHlaDQ(entity.getHlaTyping().getDonor().getHlaDQ());
                hlaTyping.setDonor(donor);
            }

            // Convert Recipient
            if (entity.getHlaTyping().getRecipient() != null) {
                HlaDetailsDTO recipient = new HlaDetailsDTO();
                recipient.setHlaA(entity.getHlaTyping().getRecipient().getHlaA());
                recipient.setHlaB(entity.getHlaTyping().getRecipient().getHlaB());
                recipient.setHlaC(entity.getHlaTyping().getRecipient().getHlaC());
                recipient.setHlaDR(entity.getHlaTyping().getRecipient().getHlaDR());
                recipient.setHlaDP(entity.getHlaTyping().getRecipient().getHlaDP());
                recipient.setHlaDQ(entity.getHlaTyping().getRecipient().getHlaDQ());
                hlaTyping.setRecipient(recipient);
            }

            // Convert Conclusion
            if (entity.getHlaTyping().getConclusion() != null) {
                HlaDetailsDTO conclusion = new HlaDetailsDTO();
                conclusion.setHlaA(entity.getHlaTyping().getConclusion().getHlaA());
                conclusion.setHlaB(entity.getHlaTyping().getConclusion().getHlaB());
                conclusion.setHlaC(entity.getHlaTyping().getConclusion().getHlaC());
                conclusion.setHlaDR(entity.getHlaTyping().getConclusion().getHlaDR());
                conclusion.setHlaDP(entity.getHlaTyping().getConclusion().getHlaDP());
                conclusion.setHlaDQ(entity.getHlaTyping().getConclusion().getHlaDQ());
                hlaTyping.setConclusion(conclusion);
            }

            dto.setHlaTyping(hlaTyping);
        }

        return dto;
    }

    // Simple conversion methods for basic embedded objects
    private AllergyHistory convertAllergyHistoryToEntity(AllergyHistoryDTO dto) {
        if (dto == null) return null;
        return new AllergyHistory(
                dto.getFoods() != null ? dto.getFoods() : false,
                dto.getDrugs() != null ? dto.getDrugs() : false,
                dto.getP() != null ? dto.getP() : false
        );
    }

    private AllergyHistoryDTO convertAllergyHistoryToDTO(AllergyHistory entity) {
        if (entity == null) return null;
        AllergyHistoryDTO dto = new AllergyHistoryDTO();
        dto.setFoods(entity.isFoods());
        dto.setDrugs(entity.isDrugs());
        dto.setP(entity.isP());
        return dto;
    }

    private FamilyHistory convertFamilyHistoryToEntity(FamilyHistoryDTO dto) {
        if (dto == null) return null;
        return new FamilyHistory(dto.getDm(), dto.getHtn(), dto.getIhd(), dto.getStroke(), dto.getRenal());
    }

    private FamilyHistoryDTO convertFamilyHistoryToDTO(FamilyHistory entity) {
        if (entity == null) return null;
        FamilyHistoryDTO dto = new FamilyHistoryDTO();
        dto.setDm(entity.getDm());
        dto.setHtn(entity.getHtn());
        dto.setIhd(entity.getIhd());
        dto.setStroke(entity.getStroke());
        dto.setRenal(entity.getRenal());
        return dto;
    }

    private SubstanceUse convertSubstanceUseToEntity(SubstanceUseDTO dto) {
        if (dto == null) return null;
        return new SubstanceUse(
                dto.getSmoking() != null ? dto.getSmoking() : false,
                dto.getAlcohol() != null ? dto.getAlcohol() : false,
                dto.getOther()
        );
    }

    private SubstanceUseDTO convertSubstanceUseToDTO(SubstanceUse entity) {
        if (entity == null) return null;
        SubstanceUseDTO dto = new SubstanceUseDTO();
        dto.setSmoking(entity.isSmoking());
        dto.setAlcohol(entity.isAlcohol());
        dto.setOther(entity.getOther());
        return dto;
    }

    private SocialHistory convertSocialHistoryToEntity(SocialHistoryDTO dto) {
        if (dto == null) return null;
        return new SocialHistory(dto.getSpouseDetails(), dto.getChildrenDetails(), dto.getIncome(), dto.getOther());
    }

    private SocialHistoryDTO convertSocialHistoryToDTO(SocialHistory entity) {
        if (entity == null) return null;
        SocialHistoryDTO dto = new SocialHistoryDTO();
        dto.setSpouseDetails(entity.getSpouseDetails());
        dto.setChildrenDetails(entity.getChildrenDetails());
        dto.setIncome(entity.getIncome());
        dto.setOther(entity.getOther());
        return dto;
    }
}
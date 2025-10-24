package com.peradeniya.renal.services;

import com.peradeniya.renal.dto.*;
import com.peradeniya.renal.model.*;
import com.peradeniya.renal.repository.DonorAssessmentRepository;
import com.peradeniya.renal.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorAssessmentService {

    private final DonorAssessmentRepository repository;
    private final PatientRepository patientRepository;

    public DonorAssessmentService(DonorAssessmentRepository repository, PatientRepository patientRepository) {
        this.repository = repository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public DonorAssessmentResponseDTO save(DonorAssessmentDTO request) {
        Patient patient = patientRepository.findByPhn(request.getPhn())
                .orElseThrow(() -> new RuntimeException("Patient not found with PHN: " + request.getPhn()));

        DonorAssessment entity = convertToEntity(request.getData());
        entity.setPatient(patient);

        DonorAssessment savedEntity = repository.save(entity);
        return convertToResponseDTO(savedEntity);
    }

    public List<DonorAssessmentResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public DonorAssessmentResponseDTO getById(Long id) {
        DonorAssessment entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor assessment not found with id: " + id));
        return convertToResponseDTO(entity);
    }

    public List<DonorAssessmentResponseDTO> getByPatientPhn(String phn) {
        return repository.findByPatientPhn(phn).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    // Assignment methods
    @Transactional
    public void assignDonorToRecipient(DonorAssignmentDTO assignment) {
        DonorAssessment donor = repository.findById(Long.parseLong(assignment.getDonorId()))
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + assignment.getDonorId()));

        donor.setStatus("assigned");
        donor.setAssignedRecipientName(assignment.getRecipientName());
        donor.setAssignedRecipientPhn(assignment.getRecipientPhn());

        repository.save(donor);
    }

    @Transactional
    public void unassignDonor(Long donorId) {
        DonorAssessment donor = repository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + donorId));

        donor.setStatus("available");
        donor.setAssignedRecipientName(null);
        donor.setAssignedRecipientPhn(null);

        repository.save(donor);
    }

    @Transactional
    public void updateDonorStatus(Long donorId, String status) {
        DonorAssessment donor = repository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found with id: " + donorId));

        donor.setStatus(status);
        repository.save(donor);
    }

    // ADD THE MISSING convertToEntity METHOD
    private DonorAssessment convertToEntity(DonorAssessmentDataDTO dto) {
        DonorAssessment entity = new DonorAssessment();

        // Copy basic donor info
        entity.setName(dto.getName());
        entity.setAge(dto.getAge());
        entity.setGender(dto.getGender());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setOccupation(dto.getOccupation());
        entity.setAddress(dto.getAddress());
        entity.setNicNo(dto.getNicNo());
        entity.setContactDetails(dto.getContactDetails());
        entity.setEmailAddress(dto.getEmailAddress());

        entity.setRelationToRecipient(dto.getRelationToRecipient());
        entity.setRelationType(dto.getRelationType());

        // Set default status
        entity.setStatus("available");

        // Copy comorbidities
        if (dto.getComorbidities() != null) {
            DonorComorbidities comorbidities = new DonorComorbidities();
            comorbidities.setDl(dto.getComorbidities().getDl() != null ? dto.getComorbidities().getDl() : false);
            comorbidities.setDm(dto.getComorbidities().getDm() != null ? dto.getComorbidities().getDm() : false);
            comorbidities.setDuration(dto.getComorbidities().getDuration());
            comorbidities.setPsychiatricIllness(dto.getComorbidities().getPsychiatricIllness() != null ? dto.getComorbidities().getPsychiatricIllness() : false);
            comorbidities.setHtn(dto.getComorbidities().getHtn() != null ? dto.getComorbidities().getHtn() : false);
            comorbidities.setIhd(dto.getComorbidities().getIhd() != null ? dto.getComorbidities().getIhd() : false);
            entity.setComorbidities(comorbidities);
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

        return entity;
    }

    // KEEP ONLY ONE convertToResponseDTO METHOD (remove the duplicate)
    private DonorAssessmentResponseDTO convertToResponseDTO(DonorAssessment entity) {
        DonorAssessmentResponseDTO dto = new DonorAssessmentResponseDTO();

        dto.setId(entity.getId());

        // Copy basic donor info
        dto.setName(entity.getName());
        dto.setAge(entity.getAge());
        dto.setGender(entity.getGender());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setOccupation(entity.getOccupation());
        dto.setAddress(entity.getAddress());
        dto.setNicNo(entity.getNicNo());
        dto.setContactDetails(entity.getContactDetails());
        dto.setEmailAddress(entity.getEmailAddress());

        dto.setRelationToRecipient(entity.getRelationToRecipient());
        dto.setRelationType(entity.getRelationType());

        // Copy status and assignment info
        dto.setStatus(entity.getStatus());
        dto.setAssignedRecipientName(entity.getAssignedRecipientName());
        dto.setAssignedRecipientPhn(entity.getAssignedRecipientPhn());

        // Copy comorbidities
        if (entity.getComorbidities() != null) {
            DonorComorbiditiesDTO comorbiditiesDTO = new DonorComorbiditiesDTO();
            comorbiditiesDTO.setDl(entity.getComorbidities().isDl());
            comorbiditiesDTO.setDm(entity.getComorbidities().isDm());
            comorbiditiesDTO.setDuration(entity.getComorbidities().getDuration());
            comorbiditiesDTO.setPsychiatricIllness(entity.getComorbidities().isPsychiatricIllness());
            comorbiditiesDTO.setHtn(entity.getComorbidities().isHtn());
            comorbiditiesDTO.setIhd(entity.getComorbidities().isIhd());
            dto.setComorbidities(comorbiditiesDTO);
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

        // Include patient PHN without circular reference
        if (entity.getPatient() != null) {
            dto.setPatientPhn(entity.getPatient().getPhn());
        }

        return dto;
    }



    // ============ CONVERSION METHODS FOR EMBEDDED OBJECTS ============

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
            respExam.setRr(dto.getRespiratory().getRr());
            respExam.setSpo2(dto.getRespiratory().getSpo2());
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
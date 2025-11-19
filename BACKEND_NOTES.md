Backend status notes

- Monthly review (Peritoneal / Hemodialysis monthly notes): use existing controller `MonthlyAssessmentController` at `/api/monthly-assessment/{patientId}`.
  - Supports GET (list), POST (create), PUT (update), DELETE (delete).
  - DTO: `MonthlyAssessmentDto` (fields include `assessmentDate`, `exitSite`, etc.).

- Hemodialysis session records:
  - Backend service/controller already implemented:
    - `HemodialysisRecordController` -> `/api/hemodialysis/{patientId}` (POST, GET), `/api/hemodialysis/record/{id}` (GET, PUT, DELETE).
    - DTO: `HemodialysisRecordDto` with `prescription`, `vascularAccess`, `session` maps (stored as JSON in entity).
  - SQL migration file added: `create_hemodialysis_table.sql` (creates `hemodialysis_record` table).

If you'd like, I can:
- Add a Flyway/Liquibase migration from these SQL files.
- Add example cURL commands to exercise the endpoints.
- Add tests or Postman collection for the APIs.

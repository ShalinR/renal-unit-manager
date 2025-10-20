package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllergyHistory {
    private boolean foods;
    private boolean drugs;
    private boolean p;

    public boolean isFoods() {
        return foods;
    }

    public void setFoods(boolean foods) {
        this.foods = foods;
    }

    public boolean isDrugs() {
        return drugs;
    }

    public void setDrugs(boolean drugs) {
        this.drugs = drugs;
    }

    public boolean isP() {
        return p;
    }

    public void setP(boolean p) {
        this.p = p;
    }
}

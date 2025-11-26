package com.peradeniya.renal.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialHistory {
    private String spouseDetails;
    private String childrenDetails;
    private String income;
    private String other;

    public String getSpouseDetails() {
        return spouseDetails;
    }

    public void setSpouseDetails(String spouseDetails) {
        this.spouseDetails = spouseDetails;
    }

    public String getChildrenDetails() {
        return childrenDetails;
    }

    public void setChildrenDetails(String childrenDetails) {
        this.childrenDetails = childrenDetails;
    }

    public String getIncome() {
        return income;
    }

    public void setIncome(String income) {
        this.income = income;
    }

    public String getOther() {
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }
}

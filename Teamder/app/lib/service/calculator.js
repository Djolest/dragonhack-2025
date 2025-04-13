class TeamMatchAlgo {
    constructor() {

        this.weights = {
            "Cultural_Fit": { "CO": 1.5, "IN": 1.3, "WB": 1.0 },
            "Role_Strengths": { "PR": 1.4, "PS": 1.2, "TA": 1.1 },
            "Leadership": { "EM": 1.6, "CR": 1.5, "AS": 1.0 },
            "Work_Env": { "RF": 1.3, "FS": 1.0 },
            "Learning": { "SL": 1.2, "MT": 1.0 }
        }


        // Thresholds for determining significant differences
        this.gap_threshold = 1.0  // Minimum difference to consider noteworthy
        this.high_gap_threshold = 1.8  // Difference considered very significant

        // Psychological safety threshold (average of CO + EM + CR)
        this.psych_safety_min = 3.5  // Teams below this need intervention
    }

    _eval_fit(candidate, team_avg) {
        match_score = this._calc_match(candidate, team_avg)
        pros_cons = this._gen_pros_cons(candidate, team_avg)

        return {
            "match_score": round(match_score, 1),
            "pros": pros_cons["pros"],
            "cons": pros_cons["cons"],
            "recommendations": pros_cons["recommendations"]
        }
    }

    _calc_match(candidate, team_avg) {
        total_score = 0
        max_possible = 0

        for (var group in candidate) {
            for (var trait in candidate[group]) {
                c_score = candidate[group][trait]
                t_score = team_avg[group][trait]
                weight = group in this.weights ? (trait in this.weights[group] ? this.weights[group][trait] : 1.0) : 1.0

                // Calculate gap and apply weight
                gap = Math.abs(c_score - t_score)
                weighted_gap = gap * weight

                // Convert to 0 - 10 scale(10 = perfect match)
                trait_score = 10 - (weighted_gap * 2)

                // Clamp score between 0 - 10
                trait_score = Math.max(0, min(10, trait_score))

                total_score += trait_score
                max_possible += 10  // Each trait contributes max 10 points
            }
        }

        // Calculate final average score
        if (max_possible > 0) { return (total_score / max_possible) * 10 }
        return 0  // Fallback for empty input
    }

    _gen_pros_cons(candidate, team_avg, team_dev) {
        pros = []
        cons = []
        recs = []

        safety_score = (team_avg["CO"] + team_avg["EM"] + team_avg["CR"]) / 3
        if (safety_score < this.psych_safety_min) {  // <-- Critical line
            cons.push("⚠️ Warning: Joining psychologically unsafe team")
            recs.push("• Mandate team coaching before onboarding")
        }

        if (team_dev["Cultural_Fit"]["CO"] >= 1.5) {
            cons.push("⚠️ Warning: Team may have unstable collaboration habits")
        } else {
            co_diff = candidate["Cultural_Fit"]["CO"] - team_avg["Cultural_Fit"]["CO"]
            if (co_diff >= this.high_gap_threshold) {
                pros.push("🤝 Supercollaborator (CO: +{:.1f} above team)".format(co_diff))
                recs.push("• Leverage as a teamwork ambassador for cross-functional projects")
            } else if (co_diff <= -this.high_gap_threshold) {
                cons.push("🧩 Collaboration gap (CO: -{:.1f} below team)".format(abs(co_diff)))
                recs.push("• Start with clearly defined solo tasks before group work")
            }
        }

        // Innovation (IN) - Important for creative teams
        if (team_dev["Cultural_Fit"]["IN"] <= 1) {
            in_diff = candidate["Cultural_Fit"]["IN"] - team_avg["Cultural_Fit"]["IN"]
            if (in_diff >= this.high_gap_threshold) {
                pros.push("💡 Innovation catalyst (IN: +{:.1f} above team)".format(in_diff))
                cons.push("Potential for clashing with the team")
                recs.push("• Assign to hackathons/innovation sprints every quarter")
            } else if (in_diff <= -this.high_gap_threshold && team_avg["Cultural_Fit"]["IN"] >= 4) {
                cons.push("🛑 Risk-averse in innovative team (IN: -{:.1f} below team)".format(abs(in_diff)))
                recs.push("• Gradually expose to innovation through case studies first")
            }
        }

        // --- ROLE-SPECIFIC TRAITS ANALYSIS ---
        // Precision (PR) - Critical for quality-focused roles
        pr_diff = candidate["Role_Strengths"]["PR"] - team_avg["Role_Strengths"]["PR"]
        if (pr_diff >= this.high_gap_threshold) {
            pros.push("🎯 Will put more thaught and care into the assigned projects)")
            recs.push("• Assign as quality control lead for critical deliverables")
        } else if (pr_diff <= -this.high_gap_threshold) {
            cons.push("🔍 Detail oversight risk (PR: -{:.1f} below team)".format(abs(pr_diff)))
            recs.push("• Implement peer-review checkpoints for their work")
        }

        // --- LEADERSHIP TRAITS ANALYSIS ---
        // Empathy (EM) - Foundation of psychological safety
        if (team_dev["Leadership"]["EM"] >= 1.5) {
            cons.push("⚠️ Warning: Big differences in team empathy levels")
        } else {
            em_diff = candidate["Leadership"]["EM"] - team_avg["Leadership"]["EM"]
            if (em_diff >= this.high_gap_threshold) {
                pros.push("❤️ Emotional intelligence anchor (EM: +{:.1f} above team)".format(em_diff))
                cons.push("May be in a difficult environment because of higher empathy")
                recs.push("• Position as conflict mediator or mentorship coordinator")
            } else if (em_diff <= -this.high_gap_threshold) {
                cons.push("😶 Emotional blindspots (EM: -{:.1f} below team)".format(abs(em_diff)))
                recs.push("• Start 1:1s with 'emotional temperature check' questions")
            } else if (Math.abs(em_diff) <= this.gap_threshold) {
                pros.push("🤗 Matching empathy levels with team")
            }
        }

        // --- SPECIAL CASE COMBINATIONS ---
        // High Assertiveness + Low Empathy = Potential bulldozer
        if (candidate["Leadership"]["AS"] >= 4 && candidate["Leadership"]["EM"] <= 2) {
            cons.push("💥 Potential bulldozer effect (higher assertiveness, lower empathy then your team)")
            pros.push("Can push for much needed change, persistent")
            recs.push("• Implement 'speaking token' in meetings to ensure equal participation")
        }

        if (candidate["Cultural_Fit"]["IN"] >= 4 && candidate["Role_Strengths"]["PR"] <= 2) {
            cons.append("🌪️ Idea generator needing grounding (high IN + low PR)")
            recs.append("• Pair with detail-oriented executor for innovation projects")
            recs.append("• Use 'idea refinement' framework before implementation")

        }

        // --- FALLBACK CONTENT GENERATION ---
        // If no significant pros/cons found (perfect match edge case)
        if (!pros) {
            pros = pros.concat([
                "✅ Well-balanced profile matching team averages",
                "🔄 Demonstrates good alignment with core team traits"
            ])
        }

        if (!cons) {
            cons = cons.concat([
                "⛔ No significant mismatches detected",
                "📊 Profile aligns well with team norms"
            ])
        }

        // Always include these baseline recommendations
        baseline_recs = [
            "• Provide clear expectations and role documentation",
            "• Assign onboarding buddy for first month",
            "• Schedule weekly 1:1s with manager for first quarter"
        ]
        recs = recs.concat(baseline_recs)

        return {
            "pros": pros,
            "cons": cons,
            "recommendations": this._prio_recs(recs)
        }
    }

    _prio_recs(self, raw_recs) {

        // Initialize empty priority buckets
        priority_map = {
            "high": [],  // Critical items that need immediate attention
            "medium": [],  // Important but not urgent
            "low": []  // General best practices
        }

        // Categorize each recommendation
        raw_recs.array.forEach(element => {
            lower_rec = element.toLowerCase()
            // High priority detection
            if (lower_rec.split(" ").some(element => ["critical", "conflict", "safety", "monitor"].includes(element))) {
                priority_map["high"].push(rec)

                // Medium priority detection
            } else if (lower_rec.split(" ").some(element => ["train", "mentor", "workshop"].includes(element))) {
                priority_map["medium"].push(rec)


                // Low priority (everything else)
            } else {
                priority_map["low"].push(rec)
            }
        });


        // Remove duplicates while preserving order
        seen = new Set()
        unique_recs = []

        // Add recommendations in priority order
        ["high", "medium", "low"].forEach(prio => {
            priority_map[prio].forEach(rec => {
                if (!seen.has(rec)) { // Only add if we haven't seen it before
                    seen.add(rec)
                    unique_recs.push(rec)
                }
            })
        })

        // Final fallback if somehow empty
        if (!unique_recs) {
            unique_recs = [
                "• Conduct manual evaluation with HR",
                "• Schedule additional interviews",
                "• Review with team lead for final decision"
            ]
        }

        return unique_recs
    }

    _team_health(team_avg) {
        issues = []

        // 1. Conflict risk (high AS + low CR)
        if (team_avg["Leadership"]["AS"] > 3.5 && team_avg["Leadership"]["CR"] < 3) {
            issues.push("High assertiveness + low conflict resolution → escalation risk")
        }

        // 2. Innovation stagnation
        if (team_avg["Cultural_Fit"]["IN"] < 2.5) {
            issues.push("Low innovation culture → growth risk")
        }

        safety_score = (team_avg["CO"] + team_avg["EM"] + team_avg["CR"]) / 3
        if (safety_score < this.psych_safety_min) {  // <-- Critical line
            issues.push("Psychologically unsafe team (low CO, EM, CR)")
        }

        return issues ? issues : ["No critical team health issues detected"]
    }
}
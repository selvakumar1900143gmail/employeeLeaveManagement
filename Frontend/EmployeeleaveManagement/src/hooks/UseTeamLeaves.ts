
import { useEffect, useState } from 'react';
import api from '../api';
import { buildSampleLeaves } from '../data/SampleLeaves.ts';
import { fromDto } from '../lib/planner';
import { isManager } from '../lib/session';
import type { LeaveDto, PlannerLeave } from '../types.ts';

interface TeamLeaveState {
    leaves: PlannerLeave[];
    loading: boolean;
    source: 'live' | 'sample';
}

export function useTeamLeaves(): TeamLeaveState {
    const [state, setState] = useState<TeamLeaveState>({
        leaves: [],
        loading: true,
        source: 'sample',
    });

    useEffect(() => {
        let cancelled = false;

        const loadSampleLeaves = () => {
            if (cancelled) return;

            setState({
                leaves: buildSampleLeaves(),
                loading: false,
                source: 'sample',
            });
        };

        if (!isManager()) {
            loadSampleLeaves();
            return;
        }

        api
            .get<LeaveDto[]>('/leaves/team')
            .then((response) => {
                if (cancelled) return;

                const teamLeaves = response.data
                    .map(fromDto)
                    .filter(
                        (leave): leave is PlannerLeave => leave !== null
                    );

                setState({
                    leaves: teamLeaves,
                    loading: false,
                    source: 'live',
                });
            })
            .catch(() => {
                loadSampleLeaves();
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}

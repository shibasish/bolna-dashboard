import React from 'react';
import { Box, Typography, Divider, Grid, Paper, AudioPlayer, List, ListItem, ListItemText } from '@mui/material';

function ExecutionMetadata({ executionDetails }) {
    console.log(`${JSON.stringify(executionDetails)}`)
    const DetailItem = ({ title, content }) => (
        <Box display="flex" justifyContent="space-between" my={1}>
            <Typography variant="subtitle1">{title}:</Typography>
            <Typography variant="body1">{typeof content === 'object' ? JSON.stringify(content) : content}</Typography>
        </Box>
    );

    const renderSection = (title, details) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            {Object.entries(details).map(([key, value]) => {
                // Check if value is an object and handle it accordingly
                if (typeof value === 'object' && value !== null) {
                    return (
                        <Box key={key} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {key}:
                            </Typography>
                            {Object.entries(value).map(([subKey, subValue]) => (
                                <DetailItem key={subKey} title={subKey} content={subValue} />
                            ))}
                        </Box>
                    );
                }
                return <DetailItem key={key} title={key} content={value} />;
            })}
        </Box>
    );

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'row', gap: 2 }}>
            {/* Left Side */}
            <Box flex={1}>
                {renderSection("Metadata", {
                    "Run ID": executionDetails.range,
                    "Run Duration": `${executionDetails.conversation_time} seconds`,
                    "Run Date": new Date(executionDetails.createdAt).toLocaleDateString(),
                    "Total Cost": `$${executionDetails.total_cost}`
                })}
                {renderSection("Usage Breakdown", {
                    "Transcriber Model": executionDetails?.usage_breakdown?.transcriberModel,
                    "Transcriber Duration": executionDetails?.usage_breakdown?.transcriberDuration,
                    "Synthesizer Model": executionDetails?.usage_breakdown?.synthesizerModel,
                    "Synthesizer Characters": executionDetails?.usage_breakdown?.synthesizerCharacters,
                    "LLM Details": executionDetails?.usage_breakdown?.llmModel
                })}

            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Right Side */}
            <Box flex={2} sx={{ pl: 2 }}>
                <Typography variant='h5'>Qualitative Details</Typography>
                {
                    executionDetails?.recording ? (
                        <>
                            <audio controls src={executionDetails.recording} style={{ width: '100%' }}>
                                Your browser does not support the audio element.
                            </audio>
                            <Divider sx={{ my: 2 }} />

                        </>
                    ) : null
                }

                {
                    executionDetails?.extracted_data ? (
                        <>
                            <Typography variant='h6'>Extraction</Typography>
                            <List>
                                {Object.entries(executionDetails.extracted_data).map(([key, value]) => (
                                    <ListItem key={key}>
                                        <ListItemText
                                            primary={key}
                                            secondary={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Divider sx={{ my: 2 }} />
                        </>
                    ) : (null)
                }

                {
                    executionDetails?.summary ? (
                        <>
                            <Typography variant='h6'>Summary</Typography>

                            {executionDetails.summary}
                            <Divider sx={{ my: 2 }} />
                        </>
                    ) : (null)
                }

                <Typography variant='h6' gutterBottom>Transcript</Typography>

                <Paper elevation={2} sx={{ mt: 2, p: 2, maxHeight: '300px', overflow: 'auto' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {executionDetails.transcript}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}



export default ExecutionMetadata;

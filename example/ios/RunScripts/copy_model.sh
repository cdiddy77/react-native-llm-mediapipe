echo "INFO: Copying model for iOS."

# Copy gemma-2b-it-cpu-int4.bin from the models built folder if it doesn't exist.
TFLITE_FILE=./gemma-2b-it-cpu-int4.bin
if test -f "$TFLITE_FILE"; then
    echo "INFO: gemma-2b-it-cpu-int4.bin exists. Skip downloading and use the local model."
else
    cp ../../models/converted/gemma-2b-it-cpu-int4.bin ${TFLITE_FILE}
    echo "INFO: Copied gemma-2b-it-cpu-int4.bin to $TFLITE_FILE ."
fi

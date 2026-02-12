// Fetch the VM IP address dynamically.
export const BACKEND_IP_ADDRESS = "127.0.0.1"//'192.168.178.77' //'127.0.0.1'//'132.231.14.120'
export const BACKEND_IP_PORT = 8000
export const BACKEND_BASE_URL = 'http://' + BACKEND_IP_ADDRESS + ':' + BACKEND_IP_PORT

// NATS
export const FETCH_SERVER_INFO = BACKEND_BASE_URL + '/dashboard/get_server_info/'
export const FETCH_SERVER_PERFORMANCE = BACKEND_BASE_URL + '/dashboard/get_server_performance_info/'
export const FETCH_START_NATS = BACKEND_BASE_URL + '/nats/start/'
export const FETCH_LIVE_PLOT_DATA = BACKEND_BASE_URL + '/nats/live_plot/'
export const FETCH_LIVE_PLOT_PROPERTIES = BACKEND_BASE_URL + '/nats/live_plot_properties/'


// Authentication
export const FETCH_REQUEST_TOKEN = BACKEND_BASE_URL + '/token/'

export const FETCH_LOGOUT = BACKEND_BASE_URL + '/authentication/logout/'


// Devices
export const FETCH_DEVICES_LIST = BACKEND_BASE_URL + '/devices/get_devices/'
export const FETCH_ADD_DEVICE = BACKEND_BASE_URL + '/devices/add_device/'


// Tests
export const FETCH_TEST_CATEGORIES = BACKEND_BASE_URL + '/tests/get_test_categories/'
export const FETCH_ADD_TEST = BACKEND_BASE_URL + '/tests/add_test/'
export const FETCH_DEFAULT_VALUES = BACKEND_BASE_URL + '/tests/get_default_values/'
export const FETCH_TEST_TEMPLATES = BACKEND_BASE_URL + '/tests/get_test_templates/'
export const FETCH_UPLOADED_TESTS = BACKEND_BASE_URL +'/tests/get_uploaded/?type='
export const FETCH_TEST_STATE = BACKEND_BASE_URL + '/nats/get_test_status/'
export const FETCH_DOWNLOAD_RESULT = BACKEND_BASE_URL + '/evaluation/get_result_zip/'
export const FETCH_DELETE_CNT_TEST_TEMPLATE = BACKEND_BASE_URL + '/tests/delete_test/?testType=cnt_puf&id='
export const FETCH_DELETE_MEMORY_TEST_TEMPLATE = BACKEND_BASE_URL + '/tests/delete_test/?testType=memory&id='


export const FETCH_SCHEDULE_TEST = BACKEND_BASE_URL + '/nats/schedule_test/'

// Evaluation
export const FETCH_EVALUATED_DATA = BACKEND_BASE_URL + '/tests/get_evaluated_data/?type='
export const FETCH_START_EVALUATION = BACKEND_BASE_URL + '/evaluation/start_evaluation/'
export const FETCH_EVALUATION_STATUS = BACKEND_BASE_URL + '/evaluation/get_status/'
export const FETCH_EVALUATION_RESULT = BACKEND_BASE_URL + '/evaluation/result/?taskID='
export const FETCH_CONNECTED_CNT_MEASUREMENTS = BACKEND_BASE_URL + '/evaluation/get_connected_measurements/?type=cnt_puf&taskID='
export const FETCH_CONNECTED_MEMORY_MEASUREMENTS = BACKEND_BASE_URL + '/evaluation/get_connected_measurements/?type=memory?taskID='
export const FETCH_VISUALIZATION_RESULT = BACKEND_BASE_URL + '/evaluation/visualizations/?taskID='
export const FETCH_DELETE_EVALUATION_RESULT = BACKEND_BASE_URL + '/evaluation/delete_result/?taskID='
export const FETCH_EVALUATION_CONFIG = BACKEND_BASE_URL + '/evaluation/get_evaluation_config/?testType='
export const FETCH_EVALUATION_TYPES = BACKEND_BASE_URL + '/evaluation/get_evaluation_types/?testCategory='

// Carbon NanoTubes
export const FETCH_WAFER_CONFIG = BACKEND_BASE_URL + '/devices/get_wafer_configs/'

// Logging
export const FETCH_LOG_MESSAGES = BACKEND_BASE_URL  + '/dashboard/get_log_messages/'
export const FETCH_LOGGING_CATEGORIES = BACKEND_BASE_URL  + '/dashboard/get_log_categories/'


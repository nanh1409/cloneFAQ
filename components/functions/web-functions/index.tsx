import { Box } from '@mui/material';
import "./webFunction.scss";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import WebFunctionItem from './WebFunctionItem';

const IconWebFunctionTestBank = dynamic(() => import('./IconWebFunctionTestBank'), {ssr: false})
const IconWebFunctionExamSimulator = dynamic(() => import('./IconWebFunctionExamSimulator'), {ssr: false})
const IconWebFunctionNoLogin = dynamic(() => import('./IconWebFunctionNoLogin'), {ssr: false})
const IconWebFunctionResultStar = dynamic(() => import('./IconWebFunctionResultStar'), {ssr: false})

const contentWebfunctions = [
    {
        icon: <IconWebFunctionTestBank iconColor='var(--iconWebFcColor)' />,
        title: {
            "vi": "Ngân hàng đề thi",
            "en": "Test bank"
        },
        description: {
            "vi": "Ngân hàng đề thi đa dạng với nhiều chủ đề khác nhau sẽ giúp bạn chuẩn bị tốt nhất cho kỳ thi của mình",
            "en": "Copious practice tests and mock tests assist you in flexibly mastering the test with diverse topics and in different areas"
        }
    },
    {
        icon: <IconWebFunctionExamSimulator iconColor='var(--iconWebFcColor)' />,
        title: {
            "vi": "Mô phỏng bài thi thật",
            "en": "Actual exam simulation"
        },
        description: {
            "vi": "Các bài thi thử có cấu trúc giống như bài thi thật sẽ giúp bạn vượt qua kỳ thi một cách thành công",
            "en": "The same format of practice test as the actual test will be such an advantage for you to ace the exam successfully."
        }
    },
    {
        icon: <IconWebFunctionNoLogin iconColor='var(--iconWebFcColor)' />,
        title: {
            "vi": "Không cần đăng nhập hoặc đăng ký",
            "en": "No sign up or log in required"
        },
        description: {
            "vi": "Không cần đăng nhập hoặc đăng ký, tiến trình học tập của bạn vẫn sẽ được lưu lại. Bạn có thể tự do luyện tập các câu hỏi với các mức độ khác nhau",
            "en": "Your learning progress will be autosaved without any account or registration, which allows you to freely practice with ascending levels of questions."
        }
    },
    {
        icon: <IconWebFunctionResultStar iconColor='var(--iconWebFcColor)' />,
        title: {
            "vi": "Thống kê kết quả chi tiết",
            "en": "Detailed Result Statistics"
        },
        description: {
            "vi": "Sau khi hoàn thành mỗi bài luyện tập, bạn có thể xem thống kê chi tiết kết quả bài làm của mình",
            "en": "Once finishing each practice test, you will be provided with detailed result statistics that show your learning progress."
        }
    },
]

const gridContainer = {
    display: "grid",
    gap: 2,
    gridTemplateColumns: {
        sm: "repeat(2, 1fr)",
        xs: "repeat(1, 1fr)"
    },
    gridAutoRows: "1fr"
};

const WebFunctions = () => {
    const router = useRouter();
    const iconColor = 'var(--iconWebFcColor)';
    return (
        <Box sx={gridContainer} id="web-function-grid">
            {
                contentWebfunctions.map((content, index) => (
                    <WebFunctionItem
                        key={index}
                        icon={content.icon}
                        title={content.title[router.locale]}
                        description={content.description[router.locale]}
                    />
                ))
            }
        </Box>
    )
    // return (
    //     <Grid container spacing={2} justifyContent="space-between" alignItems="center" textAlign="center" id="web-function-grid">
    //         {
    //             contentWebfunctions.map((content, index) => (
    //                 <Grid item xs={12} sm={6} className="grid-web-function-item" key={index}>
    //                     <WebFunctionItem
    //                         icon={content.icon}
    //                         title={content.title[router.locale]}
    //                         description={content.description[router.locale]}
    //                     />
    //                 </Grid>
    //             ))
    //         }
    //     </Grid>
    // )
}

export default WebFunctions
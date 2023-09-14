<?php

namespace DAMBundle\Controller;

use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Logger\AppLogger;
use Pimcore\Log\ApplicationLogger;
use Pimcore\Model\DataObject\Product\Listing;
use Symfony\Component\Process\Process;
use Pimcore\Bundle\AdminBundle\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Pimcore\Model\DataObject;

class DefaultController extends FrontendController
{
    /**
     * @Route("/check_process")
     */
    public function indexAction(Request $request)
    {
        $res = [];
        $products = new Listing();
        $countCommand = $products->count();
        $products->load();
        foreach ($products as $key => $line) {
            $res[$key]['id'] = $key+1;
            $res[$key]['name'] = $line->getProductName();
            $res[$key]['description'] = $line->getDescription();
        }
        $data = array(
            'ProductModel' => $res,
            'total' => $countCommand
        );
        return $this->json($data);
    }
    /**
     * @Route("/remove_process")
     */
    public function removeCheckAction(Request $request)
    {
        try {
            $processId =(int) trim($request->get('id'));
            posix_kill($processId, 9);
            $currentUser = $request->get('username');
            $opgiJob = \Pimcore\Model\DataObject\OpgiJob::getByProcessId($processId, true);
            if (!empty($opgiJob)) {
                $opgiJob->setOmitMandatoryCheck(true);
                $opgiJob->setStatus('Kill');
                $message = "This job was killed manually by ".$currentUser." due to heavy load on server";
                $endTime = new \Carbon\Carbon();
                $opgiJob->setendTime($endTime);
                $opgiJob->setdescription($message);
                $opgiJob->save();
            }
            return new JsonResponse([
                'success' => true,
                'message'=>"Process has been stopped successfully",
                'processid' => $processId,
            ], JsonResponse::HTTP_OK);
        } catch (\Exception $ex) {
            return new JsonResponse([
                'success' => false,
                'message'=>$ex->getMessage(),
                'processid' => $processId,
            ], JsonResponse::HTTP_OK);
            AppLogger::log('process-check', $ex->getMessage(), Logger::DEBUG);
        } catch (\Error $ex) {
            return new JsonResponse([
                'success' => false,
                'message'=> $ex->getMessage(),
                'processid' => $processId,
            ], JsonResponse::HTTP_OK);
            AppLogger::log('process-check', $ex->getMessage(), Logger::DEBUG);
        }
    }
}

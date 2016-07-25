using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Clarizen.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new Clarizen.Models.CTask());
        }
    }
}